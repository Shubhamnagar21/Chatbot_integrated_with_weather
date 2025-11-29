import type { CoreMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, weatherData }: { messages: CoreMessage[]; weatherData?: any } = await req.json()

  let systemPrompt = `You are a friendly AI assistant that can chat about any topic.

Guidelines:
- Respond in the same language the user uses (Japanese or English)
- If the user writes in Japanese, respond in Japanese
- If the user writes in English, respond in English
- Be helpful, friendly, and conversational
- Keep responses concise but informative
- Use markdown formatting for better readability (bold, lists, headings when appropriate)`

  // If weather data is provided, enhance the system prompt for recommendations
  if (weatherData) {
    systemPrompt += `\n\nYou have access to current weather data:
- Location: ${weatherData.location}${weatherData.country ? `, ${weatherData.country}` : ""}
- Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
- Conditions: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} m/s
- Pressure: ${weatherData.pressure} hPa
- Visibility: ${weatherData.visibility} km

When providing recommendations (music, sports, travel, agriculture), use this weather data to give contextually relevant suggestions. For example:
- Rainy weather: suggest indoor activities, cozy music, indoor attractions
- Sunny and warm: suggest outdoor activities, upbeat music, outdoor attractions
- Cold weather: suggest warm indoor activities, energetic music, indoor destinations
- Consider humidity, wind speed, and other factors when making recommendations

Format your recommendations clearly with headings and bullet points using markdown.`
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "Google API key not configured" }, { status: 500 })
  }

  // Build conversation history for Gemini format
  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: typeof msg.content === "string" ? msg.content : "" }],
  }))

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(
        { error: errorData.error?.message || "Failed to generate response" },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response."

    return Response.json({ response: text })
  } catch (error) {
    return Response.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
