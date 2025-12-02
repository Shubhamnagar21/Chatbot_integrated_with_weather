"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Sparkles,
  Music,
  Dumbbell,
  Plane,
  Sprout,
  TriangleAlert,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { useWeather } from "./weather-provider";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./language-provider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (
    message: string,
    weatherData?: any,
    skipUserMessage?: boolean
  ) => void;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useT();
  const { weather } = useWeather();
  const { language } = useLanguage();

  const handleRecommendationRequest = (theme: string) => {
    const themeNames: Record<string, string> = {
      music: t("theme.music"),
      sports: t("theme.sports"),
      travel: t("theme.travel"),
      agriculture: t("theme.agriculture"),
    };

    const themeName = themeNames[theme] || theme;

    const message = weather
      ? `Give me ${themeName.toLowerCase()} recommendations based on the current weather in ${
          weather.location
        }. Weather: ${weather.temperature}°C, ${
          weather.description
        }, humidity ${weather.humidity}%, wind speed ${weather.windSpeed} m/s.`
      : `Give me ${themeName.toLowerCase()} recommendations.`;

    onSendMessage(message, weather || undefined, true);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* ▬▬▬▬▬▬▬▬▬ SCROLLING CHAT AREA ▬▬▬▬▬▬▬▬▬ */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea
          className="h-full px-2 sm:px-4"
          ref={scrollRef}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6 break-words">
            {/* Empty state */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[45vh] text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{t("chatWithAI")}</h2>
                  <p className="text-muted-foreground max-w-md px-4">
                    {t("chatDescription")}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
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
      </div>

      {/* ▬▬▬▬▬▬▬▬▬ FIXED FOOTER (does NOT scroll) ▬▬▬▬▬▬▬▬▬ */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-2 sm:p-3 shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Recommendation Title */}
          <div className="w-full max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{t("getRecommendationsForWeather")}</span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleRecommendationRequest("music")}
              >
                <Music className="w-3 h-3" /> {t("theme.music")}
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleRecommendationRequest("sports")}
              >
                <Dumbbell className="w-3 h-3" /> {t("theme.sports")}
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleRecommendationRequest("travel")}
              >
                <Plane className="w-3 h-3" /> {t("theme.travel")}
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleRecommendationRequest("agriculture")}
              >
                <Sprout className="w-3 h-3" /> {t("theme.agriculture")}
              </Button>
            </div>
          </div>

          {/* Weather warning */}
          
          {!weather && <div className="flex items-start gap-3 px-4 py-3 mt-3 text-yellow-900 text-sm bg-yellow-300 border border-yellow-700 rounded-md shadow-lg">
            <TriangleAlert className="w-5 h-5 mt-0.5" />
            <p className="font-medium">
              {language === "ja-JP"
                ? "天気に基づいた推奨事項を取得するには、天気検索から天気データを取得してください。"
                : "Please fetch weather data from Weather Lookup to get weather-based recommendations."}
            </p>
          </div>}

          {/* Input */}
          <div className="mt-2">
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
