"use client"

import { useMemo } from "react"
import { useLanguage } from "@/components/language-provider"

type Lang = "ja-JP" | "en-US"

const translations: Record<Lang, Record<string, string>> = {
  "ja-JP": {
    title: "天気とチャットアシスタント",
    weatherLookup: "天気検索",
    enterCityPlaceholder: "都市名を入力（例: 東京, ロンドン）",
    yourLocation: "あなたの現在地",
    feels: "体感",
    feelsLike: "体感温度",
    humidity: "湿度",
    wind: "風速",
    visibility: "視程",
    pressure: "気圧",
    useCurrentLocation: "現在地を使用",
    gettingLocation: "現在地を取得中...",
    secureOriginError: "安全でないオリジンのため位置情報は許可されていません（HTTPSまたはlocalhostが必要です）",
    locationNotSupported: "このブラウザは位置情報をサポートしていません",
    locationError: "位置情報の取得に失敗しました。位置情報の許可を確認してください。",
    clearSearch: "クリアして再検索",
    chatPlaceholder: "メッセージを入力...",
    chatWithAI: "AIアシスタントとチャット",
    chatDescription: "現在の天気に基づいて、音楽、スポーツ、旅行、農業のパーソナライズされたおすすめを取得できます。音声入力は日本語と英語に対応しています。",
    listening: "聴いています",
    voiceInputNotSupported: "音声入力はサポートされていません",
    newChat: "新しいチャット",
    noRecentChats: "最近のチャットはありません",
    startNewConversation: "新しい会話を始めてください",
    expandSidebar: "サイドバーを展開",
    today: "今日",
    yesterday: "昨日",
    daysAgo: "{n} 日前",
    chatWithAI: "AIにチャットする",
    welcome: "ようこそ",
    footer: "天気: OpenWeatherMap | AI: Google Gemini | 日本語 & 英語に対応",
    getRecommendations: "{location} のおすすめを取得",
    useLanguageToggleTitle: "言語を切り替える",
    voiceInputTooltip: "音声入力",
    stopRecording: "録音を停止",
    recommendations: "おすすめ",
    "theme.music": "音楽",
    "theme.sports": "スポーツ",
    "theme.travel": "旅行",
    "theme.agriculture": "農業",
    getRecommendationsForWeather: "天気に基づいたおすすめを取得",
  },
  "en-US": {
    title: "Weather & Chat Assistant",
    weatherLookup: "Weather Lookup",
    enterCityPlaceholder: "Enter city name (e.g., Tokyo, London)",
    yourLocation: "Your location",
    feels: "Feels",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    visibility: "Visibility",
    pressure: "Pressure",
    useCurrentLocation: "Use Current Location",
    gettingLocation: "Getting location...",
    secureOriginError: "Only secure origins are allowed — geolocation requires HTTPS or localhost. Serve the app over HTTPS or use http://localhost.",
    locationNotSupported: "Geolocation is not supported by your browser",
    locationError: "Failed to get your location. Please allow location access.",
    clearSearch: "Clear & Search Again",
    chatPlaceholder: "Type your message...",
    chatWithAI: "Chat with AI Assistant",
    chatDescription: "Get personalized recommendations for Music, Sports, Travel, and Agriculture based on current weather conditions. Supports voice input in Japanese and English.",
    listening: "Listening",
    voiceInputNotSupported: "Voice input not supported",
    newChat: "New Chat",
    noRecentChats: "No recent chats",
    startNewConversation: "Start a new conversation",
    expandSidebar: "Expand sidebar",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "{n} days ago",
    chatWithAI: "Chat with AI",
    welcome: "Welcome",
    footer: "Weather: OpenWeatherMap | AI: Google Gemini | Supports Japanese & English",
    getRecommendations: "Get recommendations for {location}",
    useLanguageToggleTitle: "Toggle language",
    voiceInputTooltip: "Voice input",
    stopRecording: "Stop recording",
    recommendations: "Recommendations",
    "theme.music": "Music",
    "theme.sports": "Sports",
    "theme.travel": "Travel",
    "theme.agriculture": "Agriculture",
    getRecommendationsForWeather: "Get recommendations based on weather",
  },
}

export function useT() {
  const { language } = useLanguage()

  return useMemo(() => {
    const dict = translations[language as Lang] || translations["en-US"]

    function t(key: string, vars?: Record<string, string | number>) {
      let s = dict[key] ?? key
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
        })
      }
      return s
    }

    return { t, language }
  }, [language])
}
