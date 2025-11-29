"use client"

import * as React from "react"

type VoiceLang = "ja-JP" | "en-US"

interface LanguageContextValue {
  language: VoiceLang
  setLanguage: (lang: VoiceLang) => void
  toggleLanguage: () => void
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  initialLanguage?: VoiceLang
}) {
  // Use the server-provided initialLanguage when available so SSR and client initial render are deterministic.
  // Default to English on first load so the page does not 'pop' into a different language.
  const [language, setLanguageState] = React.useState<VoiceLang>(initialLanguage ?? "en-US")

  // Do not read localStorage on init (keeps SSR deterministic) and do not persist language automatically.
  // Language changes happen only when the user clicks the toggle — we don't want automatic persistence
  // that could cause a different initial render on subsequent loads.
  const setLanguage = React.useCallback((lang: VoiceLang) => {
    setLanguageState(lang)
  }, [])

  const toggleLanguage = React.useCallback(() => {
    setLanguageState((prev) => (prev === "ja-JP" ? "en-US" : "ja-JP"))
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
