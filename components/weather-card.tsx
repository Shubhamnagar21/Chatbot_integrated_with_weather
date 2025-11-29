"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { getWeatherIconUrl, formatTime } from "@/lib/weather-api"
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer, MapPin } from "lucide-react"
import { useT } from "@/lib/i18n"

interface WeatherCardProps {
  weather: WeatherData
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useT()
  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {weather.location}
            {weather.country && <span className="text-sm text-muted-foreground">({weather.country})</span>}
          </span>
          <img
            src={getWeatherIconUrl(weather.icon) || "/placeholder.svg"}
            alt={weather.description}
            className="w-12 h-12"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold text-primary">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1 justify-end">
              <Thermometer className="w-4 h-4" />
              <span>{t("feelsLike")} {weather.feelsLike}°C</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4 text-accent" />
            <span>{t("humidity")} {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4 text-accent" />
            <span>{t("wind")} {weather.windSpeed} m/s</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-accent" />
            <span>{t("visibility")} {weather.visibility} km</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-accent" />
            <span>{t("pressure")} {weather.pressure} hPa</span>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-border/50 text-sm">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-chart-4" />
            <span>{formatTime(weather.sunrise, weather.timezone)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="w-4 h-4 text-chart-5" />
            <span>{formatTime(weather.sunset, weather.timezone)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
