"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { VoiceRecognitionState } from "@/lib/types"

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: "",
    error: null,
    isSupported: false,
  })
  const [language, setLanguageState] = useState("ja-JP")

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const manuallyStoppedRef = useRef(false)

  useEffect(() => {
    const SpeechRecognitionAPI =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)

    setState((prev) => ({ ...prev, isSupported: !!SpeechRecognitionAPI }))

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = language

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results)
        const transcript = results.map((result) => result[0].transcript).join("")

        setState((prev) => ({ ...prev, transcript }))

        if (results[results.length - 1]?.isFinal) {
          setState((prev) => ({ ...prev, isListening: false }))
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "no-speech" || event.error === "aborted" || manuallyStoppedRef.current) {
          setState((prev) => ({ ...prev, isListening: false }))
          return
        }
        setState((prev) => ({
          ...prev,
          error: `Voice recognition error: ${event.error}`,
          isListening: false,
        }))
      }

      recognition.onend = () => {
        setState((prev) => ({ ...prev, isListening: false }))
        manuallyStoppedRef.current = false
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language])

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang)
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      manuallyStoppedRef.current = false
      setState((prev) => ({ ...prev, transcript: "", error: null, isListening: true }))
      try {
        recognitionRef.current.start()
      } catch {
        setState((prev) => ({ ...prev, error: "Could not start voice recognition", isListening: false }))
      }
    }
  }, [state.isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      manuallyStoppedRef.current = true
      recognitionRef.current.stop()
      setState((prev) => ({ ...prev, isListening: false }))
    }
  }, [state.isListening])

  const clearTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: "", error: null }))
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
    setLanguage,
  }
}
