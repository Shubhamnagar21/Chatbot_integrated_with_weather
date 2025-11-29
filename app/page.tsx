"use client"

import { useState, useEffect, useCallback } from "react"
import { ChatContainer } from "@/components/chat-container"
import { WeatherLookupPanel } from "@/components/weather-lookup-panel"
import { ChatSidebar } from "@/components/chat-sidebar"
import { WeatherProvider, useWeather } from "@/components/weather-provider"
import { CloudSun, Moon, Sun, MessageSquare, Menu } from "lucide-react"
import { useT } from "@/lib/i18n"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import {
  getChatSessions,
  saveChatSession,
  deleteChatSession,
  generateChatTitle,
  type ChatSession,
} from "@/lib/chat-storage"

// View switching removed — both weather and chat are displayed together

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function HomePageContent() {
  const [isDark, setIsDark] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Sidebar state
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const { language, toggleLanguage } = useLanguage()
  const { t } = useT()
  const { weather } = useWeather()

  // Load sessions on mount and set dark mode as default
  useEffect(() => {
    setSessions(getChatSessions())
    // Set dark mode as default
    document.documentElement.classList.add("dark")
  }, [])

  // Save current session when messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const session: ChatSession = {
        id: currentSessionId,
        title: generateChatTitle(messages[0]?.content || t("newChat")),
        messages,
        createdAt: sessions.find((s) => s.id === currentSessionId)?.createdAt || Date.now(),
        updatedAt: Date.now(),
      }
      saveChatSession(session)
      setSessions(getChatSessions())
    }
  }, [messages, currentSessionId, t])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev
      document.documentElement.classList.toggle("dark", newValue)
      return newValue
    })
  }

  

  const startNewChat = useCallback(() => {
    const newId = Date.now().toString()
    setCurrentSessionId(newId)
    setMessages([])
    // removed view-switching; chat is always visible
    setShowMobileSidebar(false)
  }, [])

  const selectSession = useCallback((session: ChatSession) => {
    setCurrentSessionId(session.id)
    setMessages(session.messages)
    // removed view-switching; chat is always visible
    setShowMobileSidebar(false)
  }, [])

  const handleDeleteSession = useCallback(
    (id: string) => {
      deleteChatSession(id)
      setSessions(getChatSessions())
      if (currentSessionId === id) {
        setCurrentSessionId(null)
        setMessages([])
      }
    },
    [currentSessionId],
  )

  const sendMessage = async (text: string, weatherData?: any, skipUserMessage?: boolean) => {
    // Create new session if needed
    if (!currentSessionId) {
      const newId = Date.now().toString()
      setCurrentSessionId(newId)
    }

    // Only add user message if not skipping (for recommendation buttons)
    if (!skipUserMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      }
      setMessages((prev) => [...prev, userMessage])
    }

    setIsLoading(true)

    try {
      const requestBody: any = {
        messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: text }],
      }
      
      // Include weather data if available (from context or explicitly passed)
      const weatherToSend = weatherData || weather
      if (weatherToSend) {
        requestBody.weatherData = weatherToSend
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        // Try to read error details from the server to show a helpful message
        let errBody: any = null
        try {
          errBody = await response.json()
        } catch (e) {
          // ignore
        }
        throw new Error(errBody?.error || `Failed to get response: ${response.statusText}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.error || "I couldn't generate a response. Please try again.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error?.message || "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button (always available on small screens) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Home button removed — showing chat and weather together */}
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-foreground text-sm">{t("title")}</h1>
            </div>
          </div>


          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label={t("useLanguageToggleTitle")}>
              <span className="text-xs font-semibold">{language === "ja-JP" ? "JP" : "EN"}</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex min-h-0">
        {/* Desktop sidebar */}
        <div className="hidden md:block h-full">
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onNewChat={startNewChat}
            onSelectSession={selectSession}
            onDeleteSession={handleDeleteSession}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {showMobileSidebar && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowMobileSidebar(false)}>
            <div className="h-full" onClick={(e) => e.stopPropagation()}>
              <ChatSidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onNewChat={startNewChat}
                onSelectSession={selectSession}
                onDeleteSession={handleDeleteSession}
                isCollapsed={false}
                onToggleCollapse={() => setShowMobileSidebar(false)}
              />
            </div>
          </div>
        )}

        {/* Main content (chat) and weather panel — stacked on small screens, side-by-side on larger screens */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Home/welcome removed — always show weather + chat panels */}

          <div className="w-full md:w-96 p-4 md:p-8 md:order-2 order-1">
            <div className="w-full max-w-md md:sticky md:top-14">
              <WeatherLookupPanel />
            </div>
          </div>

          <div className="flex-1 md:order-1 order-2 flex flex-col min-h-0">
            <ChatContainer messages={messages} isLoading={isLoading} onSendMessage={sendMessage} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-3 px-4 text-center">
        <p className="text-xs text-muted-foreground">{t("footer")}</p>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <WeatherProvider>
      <HomePageContent />
    </WeatherProvider>
  )
}
