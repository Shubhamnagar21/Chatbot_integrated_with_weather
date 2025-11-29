import { NextResponse } from "next/server"

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || ""
const OPENWEATHERMAP_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!location && (!lat || !lon)) {
    return NextResponse.json({ error: "Please provide a location or coordinates" }, { status: 400 })
  }

  if (!OPENWEATHERMAP_API_KEY) {
    return NextResponse.json({ error: "OPENWEATHERMAP_API_KEY is not configured" }, { status: 500 })
  }

  try {
    let apiUrl: string
    // Accept an optional 'lang' query param so clients can request localized descriptions
    const langParam = searchParams.get("lang") || "en"

    if (lat && lon) {
      apiUrl = `${OPENWEATHERMAP_BASE_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=${encodeURIComponent(
        langParam,
      )}`
    } else {
      apiUrl = `${OPENWEATHERMAP_BASE_URL}?q=${encodeURIComponent(location!)}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=${encodeURIComponent(
        langParam,
      )}`
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
      // Try to parse the API error body — OpenWeatherMap provides helpful messages (e.g. invalid API key)
      let body: any = null
      try {
        body = await response.json()
      } catch (e) {
        body = await response.text()
      }

      if (response.status === 404) {
        const message = (body && (body.message || body.error)) || "Weather data not found for the specified location"
        return NextResponse.json({ error: String(message) }, { status: 404 })
      }

      const apiMessage = (body && (body.message || body.error)) || response.statusText || "Unknown weather API error"
      return NextResponse.json({ error: `Weather API: ${String(apiMessage)}` }, { status: response.status })
    }

    const data = await response.json()

    const weatherData = {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API Error:", error)
    return NextResponse.json({ error: String(error instanceof Error ? error.message : "Failed to fetch weather data") }, { status: 500 })
  }
}
