"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { WeatherData } from "@/lib/types"

interface WeatherContextType {
  weather: WeatherData | null
  setWeather: (weather: WeatherData | null) => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  return <WeatherContext.Provider value={{ weather, setWeather }}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}

