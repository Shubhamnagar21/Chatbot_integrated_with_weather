"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"

interface VoiceInputButtonProps {
  isListening: boolean
  isSupported: boolean
  onStartListening: () => void
  onStopListening: () => void
  disabled?: boolean
  language?: string
}

export function VoiceInputButton({
  isListening,
  isSupported,
  onStartListening,
  onStopListening,
  disabled = false,
  language = "ja-JP",
}: VoiceInputButtonProps) {
  if (!isSupported) {
    return (
      <Button variant="outline" size="icon" disabled title="Voice input not supported">
        <MicOff className="w-5 h-5" />
      </Button>
    )
  }

  const { t } = useT()
  const langLabel = language === "ja-JP" ? "Japanese" : "English"

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={isListening ? onStopListening : onStartListening}
      disabled={disabled}
      className={cn("relative transition-all duration-200", isListening && "animate-pulse ring-2 ring-destructive/50")}
      title={isListening ? t("stopRecording") : `${t("voiceInputTooltip")} (${langLabel})`}
    >
      {isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
      {isListening && <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-ping" />}
    </Button>
  )
}
