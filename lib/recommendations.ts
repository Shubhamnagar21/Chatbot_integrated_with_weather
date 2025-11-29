import type { WeatherData } from "./types"

export type RecommendationTheme = "music" | "sports" | "travel" | "agriculture"

export interface Recommendation {
  theme: RecommendationTheme
  title: string
  description: string
  suggestions: string[]
}

export interface RecommendationContext {
  weather?: WeatherData
  location?: string
  coordinates?: { lat: number; lon: number }
}

/**
 * Generates recommendations based on weather data or location
 */
export function generateRecommendations(context: RecommendationContext): Recommendation[] {
  const { weather, location, coordinates } = context

  // If we have weather data, use it for recommendations
  if (weather) {
    return generateWeatherBasedRecommendations(weather)
  }

  // Fallback to location-based recommendations
  if (location || coordinates) {
    return generateLocationBasedRecommendations(location || "your location", coordinates)
  }

  // Default recommendations if no context
  return generateDefaultRecommendations()
}

function generateWeatherBasedRecommendations(weather: WeatherData): Recommendation[] {
  const temp = weather.temperature
  const description = weather.description.toLowerCase()
  const humidity = weather.humidity
  const windSpeed = weather.windSpeed
  const isRainy = description.includes("rain") || description.includes("drizzle") || description.includes("storm")
  const isSunny = description.includes("clear") || description.includes("sun")
  const isCloudy = description.includes("cloud")
  const isCold = temp < 10
  const isWarm = temp >= 20 && temp < 30
  const isHot = temp >= 30

  return [
    generateMusicRecommendations(weather, { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot }),
    generateSportsRecommendations(weather, { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot, windSpeed }),
    generateTravelRecommendations(weather, { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot, humidity }),
    generateAgricultureRecommendations(weather, { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot, humidity }),
  ]
}

function generateLocationBasedRecommendations(
  location: string,
  coordinates?: { lat: number; lon: number },
): Recommendation[] {
  return [
    {
      theme: "music",
      title: "Music Recommendations",
      description: `Discover music that matches the vibe of ${location}`,
      suggestions: [
        "Explore local music festivals and events",
        "Check out regional music genres and artists",
        "Find live music venues nearby",
        "Listen to location-inspired playlists",
      ],
    },
    {
      theme: "sports",
      title: "Sports & Activities",
      description: `Active options available in ${location}`,
      suggestions: [
        "Find local sports facilities and gyms",
        "Explore outdoor activity centers",
        "Check for sports events and tournaments",
        "Discover hiking trails and parks",
      ],
    },
    {
      theme: "travel",
      title: "Travel Suggestions",
      description: `Plan your visit to ${location}`,
      suggestions: [
        "Research local attractions and landmarks",
        "Find the best restaurants and cafes",
        "Explore cultural sites and museums",
        "Check seasonal events and festivals",
      ],
    },
    {
      theme: "agriculture",
      title: "Agricultural Insights",
      description: `Learn about agriculture in ${location}`,
      suggestions: [
        "Research local crops and farming practices",
        "Explore seasonal produce markets",
        "Learn about regional agricultural traditions",
        "Find farm tours and agricultural experiences",
      ],
    },
  ]
}

function generateDefaultRecommendations(): Recommendation[] {
  return [
    {
      theme: "music",
      title: "Music Recommendations",
      description: "Discover music based on your location",
      suggestions: [
        "Explore local music scenes",
        "Find music festivals nearby",
        "Discover regional artists",
        "Create location-based playlists",
      ],
    },
    {
      theme: "sports",
      title: "Sports & Activities",
      description: "Find activities suitable for current conditions",
      suggestions: [
        "Check local sports facilities",
        "Explore outdoor activities",
        "Find indoor sports options",
        "Discover fitness centers",
      ],
    },
    {
      theme: "travel",
      title: "Travel Suggestions",
      description: "Plan your next adventure",
      suggestions: [
        "Research destination attractions",
        "Find local restaurants",
        "Explore cultural sites",
        "Check travel guides",
      ],
    },
    {
      theme: "agriculture",
      title: "Agricultural Insights",
      description: "Learn about local agriculture",
      suggestions: [
        "Research local farming",
        "Explore produce markets",
        "Learn agricultural practices",
        "Find farm experiences",
      ],
    },
  ]
}

function generateMusicRecommendations(
  weather: WeatherData,
  conditions: {
    temp: number
    isRainy: boolean
    isSunny: boolean
    isCloudy: boolean
    isCold: boolean
    isWarm: boolean
    isHot: boolean
  },
): Recommendation {
  const { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot } = conditions

  let title = "Music Recommendations"
  let description = `Perfect music for ${weather.description} weather in ${weather.location}`
  let suggestions: string[] = []

  if (isRainy) {
    suggestions = [
      "Listen to calming jazz or lo-fi beats",
      "Cozy up with acoustic folk music",
      "Explore ambient and atmospheric sounds",
      "Try classical music for a peaceful mood",
    ]
  } else if (isSunny && isWarm) {
    suggestions = [
      "Upbeat pop and tropical house music",
      "Reggae and beach vibes playlists",
      "Summer festival music mixes",
      "Latin and Caribbean rhythms",
    ]
  } else if (isHot) {
    suggestions = [
      "Cool down with chill electronic music",
      "Relaxing ambient and downtempo",
      "Smooth jazz and lounge music",
      "Indoor concert recommendations",
    ]
  } else if (isCold) {
    suggestions = [
      "Warm up with energetic rock or pop",
      "Cozy indie and folk music",
      "Upbeat electronic dance music",
      "Motivational workout playlists",
    ]
  } else if (isCloudy) {
    suggestions = [
      "Mellow indie and alternative rock",
      "Thoughtful singer-songwriter tracks",
      "Atmospheric post-rock and ambient",
      "Moody jazz and blues",
    ]
  } else {
    suggestions = [
      "Explore music matching your current mood",
      "Check local music events and concerts",
      "Discover regional music genres",
      "Create a weather-inspired playlist",
    ]
  }

  return { theme: "music", title, description, suggestions }
}

function generateSportsRecommendations(
  weather: WeatherData,
  conditions: {
    temp: number
    isRainy: boolean
    isSunny: boolean
    isCloudy: boolean
    isCold: boolean
    isWarm: boolean
    isHot: boolean
    windSpeed: number
  },
): Recommendation {
  const { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot, windSpeed } = conditions

  let title = "Sports & Activities"
  let description = `Best activities for ${weather.description} conditions in ${weather.location}`
  let suggestions: string[] = []

  if (isRainy) {
    suggestions = [
      "Indoor gym workouts and fitness classes",
      "Swimming at indoor pools",
      "Rock climbing or bouldering indoors",
      "Yoga or pilates sessions",
    ]
  } else if (isSunny && isWarm) {
    suggestions = [
      "Outdoor running and jogging",
      "Cycling and bike tours",
      "Beach volleyball or water sports",
      "Tennis or outdoor sports",
    ]
  } else if (isHot) {
    suggestions = [
      "Early morning or evening workouts",
      "Swimming and water activities",
      "Indoor sports and gym activities",
      "Shaded hiking trails",
    ]
  } else if (isCold) {
    suggestions = [
      "Indoor sports and gym activities",
      "Ice skating or winter sports",
      "Hot yoga or sauna sessions",
      "Indoor climbing and fitness centers",
    ]
  } else if (isCloudy && temp >= 15) {
    suggestions = [
      "Perfect for outdoor running",
      "Cycling and hiking activities",
      "Outdoor team sports",
      "Golf or outdoor recreation",
    ]
  } else {
    suggestions = [
      "Moderate outdoor activities",
      "Mixed indoor/outdoor sports",
      "Weather-appropriate fitness routines",
      "Check local sports facilities",
    ]
  }

  if (windSpeed > 8) {
    suggestions.push("Wind sports: kite flying, windsurfing, or sailing")
  }

  return { theme: "sports", title, description, suggestions }
}

function generateTravelRecommendations(
  weather: WeatherData,
  conditions: {
    temp: number
    isRainy: boolean
    isSunny: boolean
    isCloudy: boolean
    isCold: boolean
    isWarm: boolean
    isHot: boolean
    humidity: number
  },
): Recommendation {
  const { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot, humidity } = conditions

  let title = "Travel Suggestions"
  let description = `Travel tips for ${weather.description} weather in ${weather.location}`
  let suggestions: string[] = []

  if (isRainy) {
    suggestions = [
      "Visit indoor museums and galleries",
      "Explore covered markets and shopping centers",
      "Enjoy cafes and restaurants",
      "Check out indoor entertainment venues",
    ]
  } else if (isSunny && isWarm) {
    suggestions = [
      "Perfect for outdoor sightseeing",
      "Visit parks, gardens, and outdoor attractions",
      "Beach activities and water tours",
      "Outdoor markets and festivals",
    ]
  } else if (isHot) {
    suggestions = [
      "Plan activities for early morning or evening",
      "Visit air-conditioned attractions",
      "Stay hydrated and seek shade",
      "Consider indoor cultural sites",
    ]
  } else if (isCold) {
    suggestions = [
      "Warm indoor attractions and museums",
      "Cozy cafes and restaurants",
      "Indoor shopping and entertainment",
      "Hot springs or spa experiences",
    ]
  } else if (isCloudy) {
    suggestions = [
      "Great for walking tours and sightseeing",
      "Outdoor activities without harsh sun",
      "Photography-friendly conditions",
      "Comfortable for extended outdoor exploration",
    ]
  } else {
    suggestions = [
      "Mix of indoor and outdoor activities",
      "Weather-appropriate sightseeing",
      "Local attractions and landmarks",
      "Seasonal events and experiences",
    ]
  }

  if (humidity > 70) {
    suggestions.push("High humidity: stay hydrated and take breaks")
  }

  return { theme: "travel", title, description, suggestions }
}

function generateAgricultureRecommendations(
  weather: WeatherData,
  conditions: {
    temp: number
    isRainy: boolean
    isSunny: boolean
    isCloudy: boolean
    isCold: boolean
    isWarm: boolean
    isHot: boolean
    humidity: number
  },
): Recommendation {
  const { temp, isRainy, isSunny, isCloudy, isCold, isWarm, isHot, humidity } = conditions

  let title = "Agricultural Insights"
  let description = `Farming and agriculture tips for ${weather.description} conditions in ${weather.location}`
  let suggestions: string[] = []

  if (isRainy) {
    suggestions = [
      "Good time for indoor plant care and planning",
      "Check drainage systems and water management",
      "Review crop rotation and planting schedules",
      "Prepare for post-rain field work",
    ]
  } else if (isSunny && isWarm && humidity >= 50) {
    suggestions = [
      "Ideal conditions for most crops",
      "Good time for planting and harvesting",
      "Monitor irrigation needs",
      "Excellent for outdoor farming activities",
    ]
  } else if (isHot && humidity < 40) {
    suggestions = [
      "Increase irrigation frequency",
      "Provide shade for sensitive crops",
      "Water early morning or late evening",
      "Monitor for heat stress in plants",
    ]
  } else if (isCold) {
    suggestions = [
      "Protect crops from frost if needed",
      "Consider greenhouse or indoor growing",
      "Plan for cold-weather crops",
      "Review winter farming strategies",
    ]
  } else if (isCloudy && temp >= 15) {
    suggestions = [
      "Moderate conditions for most crops",
      "Good for transplanting and delicate work",
      "Reduced water stress on plants",
      "Comfortable working conditions",
    ]
  } else {
    suggestions = [
      "Monitor weather patterns for planning",
      "Adjust farming activities to conditions",
      "Check soil moisture levels",
      "Plan seasonal agricultural activities",
    ]
  }

  if (humidity > 80) {
    suggestions.push("High humidity: watch for fungal diseases, ensure good air circulation")
  } else if (humidity < 30) {
    suggestions.push("Low humidity: increase watering and consider misting systems")
  }

  return { theme: "agriculture", title, description, suggestions }
}

