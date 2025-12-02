"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { ChatSession } from "@/lib/chat-storage";
import { useT } from "@/lib/i18n";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  isCollapsed,
  onToggleCollapse,
}: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { t } = useT();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return t("today");
    if (diffDays === 1) return t("yesterday");
    if (diffDays < 7) return t("daysAgo", { n: diffDays.toString() });
    return date.toLocaleDateString();
  };

  const groupedSessions = sessions.reduce((acc, session) => {
    const dateLabel = formatDate(session.updatedAt);
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  if (isCollapsed) {
    return (
      <div className="h-full w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="mb-4"
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        <Button
          onClick={onNewChat}
          className="flex-1 gap-2 bg-transparent"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          {t("newChat")}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable session list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                {t("noRecentChats")}
              </p>
            </div>
          ) : (
            Object.entries(groupedSessions).map(([dateLabel, dateSessions]) => (
              <div key={dateLabel} className="mb-4">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  {dateLabel}
                </p>
                {dateSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`
                      group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer
                      ${
                        currentSessionId === session.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                      }
                    `}
                    onClick={() => onSelectSession(session)}
                    onMouseEnter={() => setHoveredId(session.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <MessageSquare className="w-4 h-4" />

                    <span
                      className="flex-1 min-w-0"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {session.title}
                    </span>

                    {hoveredId === session.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id); // instant delete
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
