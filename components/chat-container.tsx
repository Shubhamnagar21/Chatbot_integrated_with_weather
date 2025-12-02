"use client"

import { useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Sparkles, Music, Dumbbell, Plane, Sprout } from "lucide-react"
import { useT } from "@/lib/i18n"
import { useWeather } from "./weather-provider"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatContainerProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string, weatherData?: any, skipUserMessage?: boolean) => void
}

export function ChatContainer({ messages, isLoading, onSendMessage }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { t } = useT()
  const { weather } = useWeather()

  const handleRecommendationRequest = (theme: string) => {
    const themeNames: Record<string, string> = {
      music: t("theme.music"),
      sports: t("theme.sports"),
      travel: t("theme.travel"),
      agriculture: t("theme.agriculture"),
    }
    const themeName = themeNames[theme] || theme
    const message = weather
      ? `Give me ${themeName.toLowerCase()} recommendations based on the current weather in ${weather.location}. Weather: ${weather.temperature}°C, ${weather.description}, humidity ${weather.humidity}%, wind speed ${weather.windSpeed} m/s.`
      : `Give me ${themeName.toLowerCase()} recommendations.`
    // Skip showing user message for recommendation buttons
    onSendMessage(message, weather || undefined, true)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6 space-y-6 break-words">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">{t("chatWithAI") || "Chat with AI Assistant"}</h2>
                <p className="text-muted-foreground max-w-md">
                  {t("chatDescription") || (
                    <>
                      Get personalized recommendations for <strong>Music</strong>, <strong>Sports</strong>, <strong>Travel</strong>, and <strong>Agriculture</strong> based on current weather conditions.
                      <br />
                      Supports voice input in Japanese and English.
                      <br />
                      <span>&#9888;</span> Please fetch the weather first from the Weather Lookup panel to enable accurate weather-based recommendations.
                    </>
                  )}
                </p>
              </div>
              {weather && (
                <div className="mt-4 space-y-3 w-full max-w-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>{t("getRecommendationsForWeather")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecommendationRequest("music")}
                      className="gap-2"
                      disabled={isLoading}
                    >
                      <Music className="w-4 h-4" />
                      {t("theme.music")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecommendationRequest("sports")}
                      className="gap-2"
                      disabled={isLoading}
                    >
                      <Dumbbell className="w-4 h-4" />
                      {t("theme.sports")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecommendationRequest("travel")}
                      className="gap-2"
                      disabled={isLoading}
                    >
                      <Plane className="w-4 h-4" />
                      {t("theme.travel")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecommendationRequest("agriculture")}
                      className="gap-2"
                      disabled={isLoading}
                    >
                      <Sprout className="w-4 h-4" />
                      {t("theme.agriculture")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} role={message.role} content={message.content} />)
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
