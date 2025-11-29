// Local storage utility for chat history

export interface ChatSession {
  id: string
  title: string
  messages: { id: string; role: "user" | "assistant"; content: string }[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = "weather-chat-sessions"

export function getChatSessions(): ChatSession[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveChatSession(session: ChatSession): void {
  if (typeof window === "undefined") return
  const sessions = getChatSessions()
  const existingIndex = sessions.findIndex((s) => s.id === session.id)
  if (existingIndex >= 0) {
    sessions[existingIndex] = session
  } else {
    sessions.unshift(session)
  }
  // Keep only last 20 sessions
  const trimmed = sessions.slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function deleteChatSession(id: string): void {
  if (typeof window === "undefined") return
  const sessions = getChatSessions().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function generateChatTitle(firstMessage: string): string {
  // Generate a title from the first message
  const cleaned = firstMessage.trim().slice(0, 40)
  return cleaned.length < firstMessage.trim().length ? cleaned + "..." : cleaned
}
