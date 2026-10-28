"use client"

import { useEffect, useRef, useState } from "react"
import { type ServiceLineData, getMarkerColorForClassification, getClassificationFullName } from "@/lib/map-utils"

declare global {
  interface Window {
    google?: typeof google
    initMap?: () => void
  }
}

interface ServiceLineMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  serviceLineData?: ServiceLineData[]
  searchedLocation?: { lat: number; lng: number }
  clickedLocation?: { lat: number; lng: number } | null
  onDoubleClickSearch?: (lat: number, lng: number) => void
  height?: string
}

export default function ServiceLineMap({
  center = { lat: 41.8781, lng: -87.6298 }, // Chicago default
  zoom = 12,
  serviceLineData = [],
  searchedLocation,
  clickedLocation,
  onDoubleClickSearch,
  height = "500px",
}: ServiceLineMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const searchMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const clickMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError("Google Maps API key not configured")
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
    }
    script.onerror = () => {
      setError("Failed to load Google Maps")
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    try {
      mapInstanceRef.current = new window.google!.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: "service-line-map",
        gestureHandling: "greedy",
      })

      // Add double-click listener for searching
      if (onDoubleClickSearch) {
        mapInstanceRef.current.addListener("dblclick", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onDoubleClickSearch(e.latLng.lat(), e.latLng.lng())
          }
        })
      }
    } catch (err) {
      console.error("Error initializing map:", err)
      setError("Failed to initialize map")
    }
  }, [isLoaded, center, zoom, onDoubleClickSearch])

  // Update map center and zoom when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    mapInstanceRef.current.setCenter(center)
    mapInstanceRef.current.setZoom(zoom)
  }, [center, zoom])

  // Update service line markers and zoom to fit them
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null
    })
    markersRef.current = []

    // If we have service line data, fit bounds to show all markers
    if (serviceLineData.length > 0) {
      const bounds = new window.google!.maps.LatLngBounds()
      
      // Include the searched/clicked location in bounds
      if (searchedLocation) {
        bounds.extend(searchedLocation)
      }
      if (clickedLocation) {
        bounds.extend(clickedLocation)
      }
      
      // Include all service line locations
      serviceLineData.forEach((data) => {
        bounds.extend({ lat: data.latitude, lng: data.longitude })
      })
      
      // Fit the map to show all markers with some padding
      mapInstanceRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 })
    }

    // Group service lines by location (using a key of lat,lng rounded to 6 decimal places)
    const groupedData = new Map<string, ServiceLineData[]>()
    serviceLineData.forEach((data) => {
      const key = `${data.latitude.toFixed(6)},${data.longitude.toFixed(6)}`
      if (!groupedData.has(key)) {
        groupedData.set(key, [])
      }
      groupedData.get(key)!.push(data)
    })

    // Add new markers for each grouped location
    groupedData.forEach((dataGroup, _key) => {
      const firstData = dataGroup[0]
      const count = dataGroup.length
      
      // Calculate marker size based on count (min 24px, max 48px)
      const baseSize = 24
      const sizeIncrement = 8
      const maxSize = 48
      const markerSize = Math.min(baseSize + (count - 1) * sizeIncrement, maxSize)
      
      // Use the highest risk classification for the marker color
      let highestRiskClassification = firstData["classification for entire service line"]
      let highestRisk = 0
      dataGroup.forEach((d) => {
        const classification = d["classification for entire service line"]
        const color = getMarkerColorForClassification(classification)
        const risk = color === "#ef4444" ? 3 : color === "#eab308" ? 2 : 1
        if (risk > highestRisk) {
          highestRisk = risk
          highestRiskClassification = classification
        }
      })
      
      const color = getMarkerColorForClassification(highestRiskClassification)
      
      const pinElement = document.createElement("div")
      pinElement.style.width = `${markerSize}px`
      pinElement.style.height = `${markerSize}px`
      pinElement.style.backgroundColor = color
      pinElement.style.borderRadius = "50%"
      pinElement.style.border = "2px solid white"
      pinElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"
      pinElement.style.cursor = "pointer"
      pinElement.style.display = "flex"
      pinElement.style.alignItems = "center"
      pinElement.style.justifyContent = "center"
      
      // Show count if more than 1 service line at this location
      if (count > 1) {
        pinElement.style.color = "white"
        pinElement.style.fontWeight = "bold"
        pinElement.style.fontSize = `${Math.max(10, markerSize / 3)}px`
        pinElement.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)"
        pinElement.textContent = count.toString()
      }

      const marker = new window.google!.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: { lat: firstData.latitude, lng: firstData.longitude },
        content: pinElement,
        title: count > 1 ? `${count} service lines at this location` : firstData.address,
      })

      // Create info window content for all service lines at this location
      let infoContent = `<div style="padding: 8px; max-width: 350px; max-height: 400px; overflow-y: auto;">`
      
      if (count > 1) {
        infoContent += `<p style="font-weight: bold; margin-bottom: 12px; color: #3b82f6;">${count} service lines at this location</p>`
      }
      
      dataGroup.forEach((data, index) => {
        if (index > 0) {
          infoContent += `<hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">`
        }
        infoContent += `
          <div>
            <h3 style="font-weight: bold; margin-bottom: 8px;">${data.address}</h3>
            <p style="margin: 4px 0;"><strong>Classification:</strong> ${getClassificationFullName(data["classification for entire service line"])}</p>
            <p style="margin: 4px 0;"><strong>Public Material:</strong> ${data.public_material || "Unknown"}</p>
            <p style="margin: 4px 0;"><strong>Private Material:</strong> ${data.private_material || "Unknown"}</p>
            <p style="margin: 4px 0;"><strong>Gooseneck/Pigtail:</strong> ${data["gooseneck/pigtail"] || "Unknown"}</p>
            <p style="margin: 4px 0;"><strong>Distance:</strong> ${data.distance.toFixed(0)} ft</p>
          </div>
        `
      })
      
      infoContent += `</div>`

      const infoWindow = new window.google!.maps.InfoWindow({
        content: infoContent,
      })

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map: mapInstanceRef.current,
        })
      })

      markersRef.current.push(marker)
    })
  }, [serviceLineData, isLoaded])

  // Update searched location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Remove existing search marker
    if (searchMarkerRef.current) {
      searchMarkerRef.current.map = null
      searchMarkerRef.current = null
    }

    if (searchedLocation) {
      const pinElement = document.createElement("div")
      pinElement.style.width = "32px"
      pinElement.style.height = "32px"
      pinElement.style.backgroundColor = "#3b82f6"
      pinElement.style.borderRadius = "50% 50% 50% 0"
      pinElement.style.border = "3px solid white"
      pinElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)"
      pinElement.style.transform = "rotate(-45deg)"

      searchMarkerRef.current = new window.google!.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: searchedLocation,
        content: pinElement,
        title: "Searched Location",
      })
    }
  }, [searchedLocation, isLoaded])

  // Update clicked location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Remove existing click marker
    if (clickMarkerRef.current) {
      clickMarkerRef.current.map = null
      clickMarkerRef.current = null
    }

    if (clickedLocation) {
      const pinElement = document.createElement("div")
      pinElement.style.width = "32px"
      pinElement.style.height = "32px"
      pinElement.style.backgroundColor = "#8b5cf6"
      pinElement.style.borderRadius = "50% 50% 50% 0"
      pinElement.style.border = "3px solid white"
      pinElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)"
      pinElement.style.transform = "rotate(-45deg)"

      clickMarkerRef.current = new window.google!.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: clickedLocation,
        content: pinElement,
        title: "Selected Location",
      })
    }
  }, [clickedLocation, isLoaded])

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200"
        style={{ height }}
      >
        <p className="text-slate-500">{error}</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200"
        style={{ height }}
      >
        <p className="text-slate-500">Loading map...</p>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="rounded-lg overflow-hidden border border-slate-200"
      style={{ height, width: "100%" }}
    />
  )
}
