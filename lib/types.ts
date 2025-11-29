export interface WeatherData {
  location: string
  country?: string
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  pressure: number
  visibility: number
  sunrise: number
  sunset: number
  timezone: number
  coordinates?: {
    lat: number
    lon: number
  }
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  weatherData?: WeatherData
  timestamp: Date
}

export interface VoiceRecognitionState {
  isListening: boolean
  transcript: string
  error: string | null
  isSupported: boolean
}
