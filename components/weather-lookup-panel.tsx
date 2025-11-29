"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherCard } from "./weather-card"
import { Search, Navigation, Loader2, MapPin, X } from "lucide-react"
import type { WeatherData } from "@/lib/types"

import { useT } from "@/lib/i18n"
import { useLanguage } from "./language-provider"
import { useWeather } from "./weather-provider"

export function WeatherLookupPanel() {
  const { t } = useT()
  const [locationInput, setLocationInput] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"idle" | "location" | "current">("idle")
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | undefined>(undefined)
  const { setWeather: setWeatherContext } = useWeather()

  const { language } = useLanguage()

  // Update context when weather changes
  useEffect(() => {
    setWeatherContext(weather)
  }, [weather, setWeatherContext])

  const getLangParam = () => (language?.startsWith("ja") ? "ja" : "en")

  const fetchWeatherByLocation = useCallback(async () => {
    if (!locationInput.trim()) return

    setLoading(true)
    setError(null)
    setMode("location")

    try {
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(locationInput.trim())}&lang=${getLangParam()}`,
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch weather")
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }, [locationInput, language])

  const fetchCurrentLocationWeather = useCallback(async () => {
    setLoading(true)
    setError(null)
    setMode("current")

    // Check for secure origin first - geolocation requires HTTPS or localhost
    try {
      // isSecureContext is supported widely; fallback to protocol check
      // eslint-disable-next-line no-undef
      const secure = typeof window !== "undefined" && (window.isSecureContext || window.location.protocol === "https:")
      if (!secure) {
        setError(t("secureOriginError"))
        setLoading(false)
        return
      }
    } catch (err) {
      // if anything goes wrong with the check, continue to attempt geolocation and rely on the browser error
    }

    if (!navigator.geolocation) {
      setError(t("locationNotSupported"))
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setCoordinates({ lat: latitude, lon: longitude })
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}&lang=${getLangParam()}`)

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || "Failed to fetch weather")
          }

          const data = await response.json()
          setWeather(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch weather")
          setWeather(null)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        const msg = err?.message || ""
        if (msg.includes("Only secure origins")) {
          // show browser-provided message verbatim
          setError(msg)
        } else {
          setError(msg || t("locationError"))
        }

        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [language, t])

  const clearWeather = useCallback(() => {
    setWeather(null)
    setError(null)
    setMode("idle")
    setLocationInput("")
    setCoordinates(undefined)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeatherByLocation()
    }
  }

  return (
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          {t("weatherLookup")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={t("enterCityPlaceholder")}
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
              disabled={loading}
            />
            {locationInput && (
              <button
                onClick={() => setLocationInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={fetchWeatherByLocation} disabled={loading || !locationInput.trim()} size="icon">
            {loading && mode === "location" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Current Location Button */}
        <Button
          variant="outline"
          onClick={fetchCurrentLocationWeather}
          disabled={loading}
          className="w-full gap-2 bg-transparent"
        >
          {loading && mode === "current" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("gettingLocation")}
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              {t("useCurrentLocation")}
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Weather Result */}
        {weather && (
          <div className="space-y-3">
            <WeatherCard weather={weather} />
            <Button variant="ghost" onClick={clearWeather} className="w-full text-muted-foreground" size="sm">
              {t("clearSearch")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
