"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useT } from "@/lib/i18n"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VoiceInputButton } from "./voice-input-button"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { Send, Loader2 } from "lucide-react"
import { useWeather } from "./weather-provider"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

type VoiceLang = "ja-JP" | "en-US"

const VOICE_LANGUAGES: { value: VoiceLang; label: string; flag: string }[] = [
  { value: "ja-JP", label: "Japanese", flag: "JP" },
  { value: "en-US", label: "English", flag: "US" },
]

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const { language } = useLanguage()
  const { weather } = useWeather()

  const { isListening, transcript, isSupported, error, startListening, stopListening, clearTranscript, setLanguage } =
    useVoiceRecognition()

  useEffect(() => {
    setLanguage(language)
  }, [language, setLanguage])

  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      if (isListening) {
        stopListening()
      }
      onSendMessage(input.trim())
      setInput("")
      clearTranscript()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const currentLang = VOICE_LANGUAGES.find((l) => l.value === (language as VoiceLang))

  const { t } = useT()

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      {error && <p className="text-sm text-destructive px-2">{error}</p>}

      {/* 🔊 Listening Status */}
      {isListening && (
        <p className="text-sm text-muted-foreground px-2 animate-pulse">
          {t("listening")} ({currentLang?.label})...
        </p>
      )}

      <div className="flex gap-2 items-end pt-2">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chatPlaceholder")}
            className="min-h-12 max-h-[200px] resize-none pr-12 bg-input/50"
            disabled={isLoading || disabled}
            rows={1}
          />
        </div>

        <div className="flex gap-2">
          <VoiceInputButton
            isListening={isListening}
            isSupported={isSupported}
            onStartListening={startListening}
            onStopListening={stopListening}
            disabled={isLoading || disabled}
            language={language}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading || disabled}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
