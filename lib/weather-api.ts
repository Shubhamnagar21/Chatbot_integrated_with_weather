import type { WeatherData } from "./types"

const OPENWEATHERMAP_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

export async function fetchWeatherByLocation(location: string, apiKey: string): Promise<WeatherData> {
  const response = await fetch(
    `${OPENWEATHERMAP_BASE_URL}?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=en`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`)
  }

  const data = await response.json()
  return mapWeatherResponse(data)
}

export async function fetchWeatherByCoordinates(lat: number, lon: number, apiKey: string): Promise<WeatherData> {
  const response = await fetch(`${OPENWEATHERMAP_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`)

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`)
  }

  const data = await response.json()
  return mapWeatherResponse(data)
}

function mapWeatherResponse(data: Record<string, unknown>): WeatherData {
  const main = data.main as Record<string, number>
  const weather = (data.weather as Array<Record<string, string>>)[0]
  const wind = data.wind as Record<string, number>
  const sys = data.sys as Record<string, unknown>
  const coord = data.coord as Record<string, number>

  return {
    location: data.name as string,
    country: sys.country as string,
    temperature: Math.round(main.temp),
    feelsLike: Math.round(main.feels_like),
    humidity: main.humidity,
    description: weather.description,
    icon: weather.icon,
    windSpeed: wind.speed,
    pressure: main.pressure,
    visibility: (data.visibility as number) / 1000,
    sunrise: sys.sunrise as number,
    sunset: sys.sunset as number,
    timezone: data.timezone as number,
    coordinates: {
      lat: coord.lat,
      lon: coord.lon,
    },
  }
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

export function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  })
}
