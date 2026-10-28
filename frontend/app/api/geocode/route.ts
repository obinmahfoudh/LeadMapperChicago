import { NextResponse } from "next/server"
// API received an address and attempts to geocode it using google geocoding API
// Returns geocode for address 

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: `Geocoding API error: ${data.status}`, details: data.error_message },
        { status: 400 },
      )
    }

    const { lat, lng } = data.results[0].geometry.location

    return NextResponse.json({
      address,
      location: { lat, lng },
      formattedAddress: data.results[0].formatted_address,
      placeId: data.results[0].place_id,
    })
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}
