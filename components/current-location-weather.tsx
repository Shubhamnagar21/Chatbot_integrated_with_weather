"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, Loader2, MapPin, Thermometer, Droplets, Wind } from "lucide-react"
import { useT } from "@/lib/i18n"
import { useLanguage } from "./language-provider"
import type { WeatherData } from "@/lib/types"
import { getWeatherIconUrl } from "@/lib/weather-api"

interface CurrentLocationWeatherProps {
  onUseWeather: (location: string) => void
}

export function CurrentLocationWeather({ onUseWeather }: CurrentLocationWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { t } = useT()
  const { language } = useLanguage()
  const getLangParam = () => (language?.startsWith("ja") ? "ja" : "en")

  const fetchCurrentLocationWeather = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Don't attempt geolocation on insecure origins — show clear guidance instead
    try {
      // eslint-disable-next-line no-undef
      const secure = typeof window !== "undefined" && (window.isSecureContext || window.location.protocol === "https:")
      if (!secure) {
        setError(t("secureOriginError"))
        setLoading(false)
        return
      }
    } catch (e) {
      // ignore and allow geolocation errors to surface
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
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}&lang=${getLangParam()}`)

          if (!response.ok) {
            let body: any = null
            try {
              body = await response.json()
            } catch (e) {
              // ignore
            }
            throw new Error(body?.error || response.statusText || "Failed to fetch weather")
          }

          const data = await response.json()
          setWeather(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : t("locationError"))
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        const msg = err?.message || ""
        if (msg.includes("Only secure origins")) {
          // show browser message verbatim
          setError(msg)
        } else {
          setError(msg || t("locationError"))
        }

        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
      )
    }, [language, t])

  if (weather) {
      return (
        <Card className="w-full max-w-sm bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{t("yourLocation")}</span>
            </div>
            <span className="text-xs text-muted-foreground">{weather.location}</span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={getWeatherIconUrl(weather.icon) || "/placeholder.svg"}
              alt={weather.description}
              className="w-16 h-16"
            />
            <div className="flex-1">
              <div className="text-3xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground capitalize">{weather.description}</div>
            </div>
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              {t("feels")} {weather.feelsLike}°C
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {weather.humidity}%
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              {weather.windSpeed} m/s
            </div>
          </div>

          <Button onClick={() => onUseWeather(weather.location)} className="w-full mt-3" size="sm">
            {t("getRecommendations", { location: weather.location })}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button variant="outline" onClick={fetchCurrentLocationWeather} disabled={loading} className="gap-2 bg-transparent">
          {loading ? (
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
      {error && <span className="text-destructive text-xs ml-2">{error}</span>}
    </Button>
  )
}
