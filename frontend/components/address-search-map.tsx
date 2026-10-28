"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, LoaderIcon, SearchIcon, HomeIcon, AlertTriangleIcon, InfoIcon } from "lucide-react"
import ServiceLineMap from "@/components/service-line-map"
import { type ServiceLineData, getClassificationRiskLevel, getClassificationFullName } from "@/lib/map-utils"

declare global {
  interface Window {
    google?: typeof google
  }
}

// API URL - replace with your actual API URL in production
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_LINE_API_URL || "http://127.0.0.1:8000"

export default function AddressSearchMap() {
  const [address, setAddress] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [serviceLineData, setServiceLineData] = useState<ServiceLineData[]>([])
  const [nearbyCount, setNearbyCount] = useState<number>(5)
  const [noDataAvailable, setNoDataAvailable] = useState(false)
  const [isDataExpanded, setIsDataExpanded] = useState<boolean>(false)
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const autocompleteInitialized = useRef(false)
  const nearbyCountRef = useRef(nearbyCount)

  // Keep the ref in sync with state
  useEffect(() => {
    nearbyCountRef.current = nearbyCount
  }, [nearbyCount])

  // Wait for Google Maps to be loaded (script is loaded by ServiceLineMap)
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setScriptLoaded(true)
      return
    }

    const checkGoogleExists = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setScriptLoaded(true)
        clearInterval(checkInterval)
      }
    }

    const checkInterval = setInterval(checkGoogleExists, 100)

    const timeout = setTimeout(() => {
      clearInterval(checkInterval)
      if (!window.google || !window.google.maps) {
        setApiError(true)
        setError("Google Maps failed to load. Please check your API key configuration.")
      }
    }, 15000)

    const handleGoogleMapsError = (event: ErrorEvent) => {
      if (event.message && event.message.includes("Google Maps JavaScript API")) {
        setApiError(true)
        setError("Google Maps API error occurred. This may be due to API key restrictions.")
        clearInterval(checkInterval)
        clearTimeout(timeout)
      }
    }

    window.addEventListener("error", handleGoogleMapsError)

    return () => {
      clearInterval(checkInterval)
      clearTimeout(timeout)
      window.removeEventListener("error", handleGoogleMapsError)
    }
  }, [])

  // Initialize autocomplete when script is loaded and input is available
  useEffect(() => {
    if (scriptLoaded && inputRef.current && !autocompleteInitialized.current && !apiError) {
      try {
        autocompleteRef.current = new window.google!.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["formatted_address", "geometry", "place_id"],
          componentRestrictions: { country: "us" },
        })

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace()

          if (place && place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()

            setLocation({ lat, lng })
            setFormattedAddress(place.formatted_address || "")
            setClickedLocation(null)

            if (place.formatted_address) {
              setAddress(place.formatted_address)
              fetchServiceLineData(lng, lat, nearbyCountRef.current)
            }
          }
        })

        autocompleteInitialized.current = true
      } catch (err) {
        console.error("Error initializing Google Places Autocomplete:", err)
        setError("Failed to initialize address autocomplete")
      }
    }
  }, [scriptLoaded, apiError, nearbyCount])

  const handleManualSearch = async () => {
    if (!address.trim()) return

    setLoading(true)
    setError(null)
    setNoDataAvailable(false)
    setServiceLineData([])
    setClickedLocation(null)

    try {
      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to geocode address")
      }

      setLocation(data.location)
      setFormattedAddress(data.formattedAddress)

      await fetchServiceLineData(data.location.lng, data.location.lat, nearbyCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  const handleDoubleClickSearch = async (lat: number, lng: number) => {
    setClickedLocation({ lat, lng })
    setFormattedAddress(`Selected Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    setLocation({ lat, lng })
    setError(null)
    setNoDataAvailable(false)
    await fetchServiceLineData(lng, lat, nearbyCountRef.current)
  }

  const fetchServiceLineData = async (longitude: number, latitude: number, k: number) => {
    setLoading(true)
    setNoDataAvailable(false)

    try {
      const apiUrl = `${API_BASE_URL}/nearest?lon=${longitude}&lat=${latitude}&k=${k}`

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.nearest_lines && data.nearest_lines.length > 0) {
        setServiceLineData(data.nearest_lines)
      } else {
        setNoDataAvailable(true)
        setServiceLineData([])
      }
    } catch (err) {
      console.error("Error fetching service line data:", err)
      setError(`Failed to fetch service line data: ${err instanceof Error ? err.message : String(err)}`)
      setNoDataAvailable(true)
      setServiceLineData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5" />
            Find Your Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiError ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
              <div className="flex items-start">
                <AlertTriangleIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Google Maps API Error</p>
                  <p className="text-sm text-amber-700">
                    The Google Maps API couldn&apos;t be loaded due to API key restrictions. Address autocomplete is not
                    available, but you can still use the manual search.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <Input
                  id="address"
                  ref={inputRef}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address..."
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={nearbyCount}
                    onChange={(e) => setNearbyCount(Number.parseInt(e.target.value) || 5)}
                    placeholder="Nearby"
                    disabled={loading}
                    className="w-full"
                    title="Number of nearby addresses to show"
                  />
                </div>
                <Button
                  onClick={handleManualSearch}
                  disabled={loading || !address.trim()}
                  className="whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Enter an address to search and specify how many nearby service lines to display (1-20)
            </div>
          </div>

          {error && !apiError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
          )}

          {formattedAddress && (
            <div className="mt-4 p-3 bg-secondary rounded-md">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Found Address:</p>
                  <p className="text-sm">{formattedAddress}</p>
                </div>
              </div>
            </div>
          )}

          {noDataAvailable && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">No Service Line Data Available</p>
                  <p className="text-sm text-amber-700">
                    We don&apos;t have specific service line information for this address or nearby locations. This doesn&apos;t
                    mean your home is safe from lead - many Chicago homes built before 1986 have lead service lines.
                    Consider getting your water tested.
                  </p>
                </div>
              </div>
            </div>
          )}

          {serviceLineData.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Service Line Data Found</p>
                  <p className="text-sm text-blue-700">
                    Found {serviceLineData.length} service line records. Click on the markers for detailed information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-3 mb-0">
        <p className="text-xs text-muted-foreground">
          Tip: Double-click anywhere on the map to check for service lines at that location.
        </p>
      </Card>

      <ServiceLineMap
        center={location || undefined}
        zoom={location ? 16 : 12}
        serviceLineData={serviceLineData}
        searchedLocation={clickedLocation ? undefined : (location || undefined)}
        clickedLocation={clickedLocation}
        onDoubleClickSearch={handleDoubleClickSearch}
        height="500px"
      />

      {serviceLineData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Service Line Data ({serviceLineData.length} records)</span>
              <Button variant="ghost" size="sm" onClick={() => setIsDataExpanded(!isDataExpanded)} className="h-8 px-2">
                {isDataExpanded ? "Hide Details" : "Show Details"}
              </Button>
            </CardTitle>
          </CardHeader>
          {isDataExpanded && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Address</th>
                      <th className="text-left py-2 px-2">Classification</th>
                      <th className="text-left py-2 px-2">Public Material</th>
                      <th className="text-left py-2 px-2">Private Material</th>
                      <th className="text-left py-2 px-2">Gooseneck/Pigtail</th>
                      <th className="text-right py-2 px-2">Distance (ft)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceLineData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">{item.address}</td>
                        <td className="py-2 px-2">
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded-full ${getClassificationRiskLevel(item["classification for entire service line"]) === "high"
                                ? "bg-red-100 text-red-800"
                                : getClassificationRiskLevel(item["classification for entire service line"]) === "low"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {getClassificationFullName(item["classification for entire service line"])}
                          </span>
                        </td>
                        <td className="py-2 px-2">{item.public_material}</td>
                        <td className="py-2 px-2">{item.private_material}</td>
                        <td className="py-2 px-2">{item["gooseneck/pigtail"]}</td>
                        <td className="py-2 px-2 text-right">{item.distance.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {location && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-secondary/50 rounded-md">
                <p className="text-sm font-medium">Latitude</p>
                <p className="font-mono">{location.lat.toFixed(6)}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-md">
                <p className="text-sm font-medium">Longitude</p>
                <p className="font-mono">{location.lng.toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Lead Service Lines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5" />
            About Lead Service Lines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Lead service lines are pipes that connect the water main in the street to homes and buildings. 
            Chicago has one of the highest concentrations of lead service lines in the nation, with an estimated 
            400,000+ homes potentially affected.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-red-50 rounded-md border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="font-medium text-red-800">High Risk</span>
              </div>
              <p className="text-xs text-red-700">
                Lead (L) or Galvanized Requiring Replacement (GRR) - Known lead presence or galvanized pipes downstream of lead.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="font-medium text-yellow-800">Unknown</span>
              </div>
              <p className="text-xs text-yellow-700">
                Classification unknown (U) - Service line material has not been verified. Testing recommended.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-medium text-green-800">Low Risk</span>
              </div>
              <p className="text-xs text-green-700">
                Copper (C) or Not Lead (NL/UNL) - Verified non-lead materials in service line.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              For more information about health effects and mitigation strategies, visit the{" "}
              <a 
                href="https://82-below.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 underline"
              >
                original team project
              </a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
