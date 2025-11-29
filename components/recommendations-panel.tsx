"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Music,
  Dumbbell,
  Plane,
  Sprout,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react"
import { useT } from "@/lib/i18n"
import type { WeatherData } from "@/lib/types"
import { generateRecommendations, type Recommendation, type RecommendationTheme } from "@/lib/recommendations"

interface RecommendationsPanelProps {
  weather?: WeatherData | null
  location?: string
  coordinates?: { lat: number; lon: number }
}

const themeIcons: Record<RecommendationTheme, typeof Music> = {
  music: Music,
  sports: Dumbbell,
  travel: Plane,
  agriculture: Sprout,
}

const themeColors: Record<RecommendationTheme, string> = {
  music: "text-purple-500",
  sports: "text-blue-500",
  travel: "text-green-500",
  agriculture: "text-orange-500",
}

export function RecommendationsPanel({ weather, location, coordinates }: RecommendationsPanelProps) {
  const { t } = useT()
  const [expandedThemes, setExpandedThemes] = useState<Set<RecommendationTheme>>(new Set())
  const [activeTab, setActiveTab] = useState<RecommendationTheme>("music")

  const recommendations = generateRecommendations({ weather: weather || undefined, location, coordinates })

  const toggleTheme = (theme: RecommendationTheme) => {
    setExpandedThemes((prev) => {
      const next = new Set(prev)
      if (next.has(theme)) {
        next.delete(theme)
      } else {
        next.add(theme)
      }
      return next
    })
  }

  // Don't show recommendations if we have no context at all
  if (!weather && !location && !coordinates) {
    return null
  }

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          {t("recommendations")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RecommendationTheme)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {recommendations.map((rec) => {
              const Icon = themeIcons[rec.theme]
              return (
                <TabsTrigger key={rec.theme} value={rec.theme} className="flex flex-col gap-1 h-auto py-2">
                  <Icon className={`w-4 h-4 ${themeColors[rec.theme]}`} />
                  <span className="text-xs">{t(`theme.${rec.theme}`)}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {recommendations.map((rec) => (
            <TabsContent key={rec.theme} value={rec.theme} className="mt-0">
              <RecommendationCard
                recommendation={rec}
                isExpanded={expandedThemes.has(rec.theme)}
                onToggle={() => toggleTheme(rec.theme)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface RecommendationCardProps {
  recommendation: Recommendation
  isExpanded: boolean
  onToggle: () => void
}

function RecommendationCard({ recommendation, isExpanded, onToggle }: RecommendationCardProps) {
  const { t } = useT()
  const Icon = themeIcons[recommendation.theme]
  const colorClass = themeColors[recommendation.theme]

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-5 h-5 ${colorClass}`} />
            <h3 className="font-semibold text-sm">{recommendation.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{recommendation.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          {recommendation.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <Badge variant="outline" className="mt-0.5 h-5 px-1.5 text-xs shrink-0">
                {index + 1}
              </Badge>
              <span className="text-muted-foreground">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

