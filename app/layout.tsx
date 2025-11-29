import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Weather Assistant | AI-Powered Weather Chatbot",
  description:
    "An AI-powered chatbot combining weather data with intelligent travel and outing recommendations. Supports Japanese and English voice input.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
    generator: 'Shubham Nagar'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3B82F6" },
    { media: "(prefers-color-scheme: dark)", color: "#1E3A5F" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansJP.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
