# Weather & Chat Assistant

A modern, AI-powered chatbot application that combines real-time weather data with intelligent recommendations. Built with Next.js, TypeScript, and Tailwind CSS.

![Weather & Chat Assistant](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🌤️ Weather Integration
- **Real-time Weather Data**: Get current weather conditions for any location worldwide
- **Geolocation Support**: Automatically fetch weather for your current location
- **Detailed Metrics**: Temperature, humidity, wind speed, pressure, visibility, sunrise/sunset times
- **Beautiful Weather Cards**: Modern UI with weather icons and organized data display

### 🤖 AI-Powered Chat
- **Google Gemini 2.5 Flash**: Advanced AI conversations powered by Google's latest model
- **Context-Aware Recommendations**: Get personalized suggestions based on current weather conditions
- **Theme-Based Recommendations**: 
  - 🎵 **Music**: Weather-appropriate music recommendations
  - 🏃 **Sports**: Activity suggestions based on weather conditions
  - ✈️ **Travel**: Travel tips and destination recommendations
  - 🌾 **Agriculture**: Farming and agricultural insights
- **Markdown Support**: Rich text formatting in AI responses
- **Chat History**: Save and manage multiple chat sessions

### 🎤 Voice Input
- **Multi-language Support**: Japanese (ja-JP) and English (en-US) voice recognition
- **Web Speech API**: Real-time speech-to-text conversion
- **Easy Language Toggle**: Switch between languages seamlessly

### 🎨 Modern UI/UX
- **Dark Mode Default**: Beautiful dark theme with modern color palette
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and hover effects
- **Modern Typography**: Inter font family for excellent readability
- **Accessible**: Built with accessibility in mind

### 🌍 Internationalization
- **Bilingual Support**: Full support for English and Japanese
- **Language Toggle**: Easy switching between languages
- **Localized Content**: All UI elements translated

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Weather API**: [OpenWeatherMap](https://openweathermap.org/api)
- **AI Model**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Voice Recognition**: Web Speech API
- **Fonts**: Inter, JetBrains Mono, Noto Sans JP

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **npm**, **yarn**, or **pnpm** package manager
- **OpenWeatherMap API Key** ([Get it free here](https://openweathermap.org/api))
- **Google Gemini API Key** ([Get it free here](https://aistudio.google.com/apikey))

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd chatbot-with-weather
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here
```

**Getting API Keys:**

- **OpenWeatherMap**: 
  1. Sign up at [openweathermap.org](https://openweathermap.org/api)
  2. Navigate to API keys section
  3. Copy your free API key

- **Google Gemini**:
  1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
  2. Sign in with your Google account
  3. Create a new API key
  4. Copy the generated key

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
chatbot-with-weather/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Gemini AI chat endpoint with weather context
│   │   └── weather/
│   │       └── route.ts          # Weather API endpoint
│   ├── globals.css               # Global styles and theme variables
│   ├── layout.tsx                # Root layout with font configuration
│   └── page.tsx                  # Main page component
├── components/
│   ├── chat-container.tsx        # Chat UI container with recommendation buttons
│   ├── chat-input.tsx             # Chat input with voice support
│   ├── chat-message.tsx          # Message display with markdown rendering
│   ├── chat-sidebar.tsx          # Chat history sidebar
│   ├── recommendations-panel.tsx # Theme-based recommendations (deprecated in UI)
│   ├── weather-card.tsx           # Weather data display card
│   ├── weather-lookup-panel.tsx   # Weather search and lookup panel
│   ├── weather-provider.tsx       # Weather context provider
│   ├── language-provider.tsx     # Language context provider
│   ├── theme-provider.tsx        # Theme context provider
│   └── ui/                       # shadcn/ui components
├── hooks/
│   ├── use-voice-recognition.ts  # Voice recognition hook
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   ├── chat-storage.ts           # Local storage for chat sessions
│   ├── i18n.tsx                  # Internationalization translations
│   ├── recommendations.ts       # Recommendation generation logic
│   ├── types.ts                  # TypeScript type definitions
│   ├── utils.ts                  # Utility functions
│   └── weather-api.ts             # Weather API utilities
├── public/                       # Static assets
└── styles/                       # Additional styles
```

## 🔌 API Endpoints

### POST /api/chat

Sends a message to the Gemini AI with optional weather context.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Give me music recommendations" }
  ],
  "weatherData": {
    "location": "Tokyo",
    "temperature": 25,
    "description": "clear sky",
    "humidity": 60,
    "windSpeed": 3.5
  }
}
```

**Response:**
```json
{
  "response": "Based on the current weather in Tokyo..."
}
```

### GET /api/weather

Fetches weather data for a location.

**Query Parameters:**
- `location` (string, optional): City name (e.g., "Tokyo", "London")
- `lat` (number, optional): Latitude for coordinates-based lookup
- `lon` (number, optional): Longitude for coordinates-based lookup
- `lang` (string, optional): Language code (default: "en")

**Example:**
```
GET /api/weather?location=Tokyo&lang=en
GET /api/weather?lat=35.6762&lon=139.6503&lang=ja
```

**Response:**
```json
{
  "location": "Tokyo",
  "country": "JP",
  "temperature": 25,
  "feelsLike": 26,
  "humidity": 60,
  "description": "clear sky",
  "icon": "01d",
  "windSpeed": 3.5,
  "pressure": 1013,
  "visibility": 10,
  "sunrise": 1234567890,
  "sunset": 1234567890,
  "timezone": 32400,
  "coordinates": {
    "lat": 35.6762,
    "lon": 139.6503
  }
}
```

## 🎯 Usage

### Getting Weather Data

1. **Search by City Name**: Enter a city name in the search box and click the search icon
2. **Use Current Location**: Click "Use Current Location" to get weather for your current position (requires location permission)

### Getting Recommendations

1. **Fetch Weather First**: Get weather data for a location
2. **Click Recommendation Buttons**: In the chat interface, click on Music, Sports, Travel, or Agriculture buttons
3. **AI-Powered Suggestions**: The AI will provide contextual recommendations based on the current weather conditions

### Voice Input

1. **Click Microphone Button**: Click the microphone icon in the chat input
2. **Select Language**: Choose between Japanese (JP) or English (EN)
3. **Start Speaking**: Your speech will be converted to text automatically
4. **Stop Recording**: Click the microphone again to stop and send

### Chat Features

- **New Chat**: Start a fresh conversation anytime
- **Chat History**: Access previous conversations from the sidebar
- **Delete Chats**: Remove unwanted chat sessions
- **Auto-save**: All chats are automatically saved to local storage

## 🎨 Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: oklch(0.55 0.2 250);  /* Primary color */
  --accent: oklch(0.65 0.18 200);  /* Accent color */
  /* ... */
}
```

### Changing Fonts

Fonts are configured in `app/layout.tsx`. Currently using:
- **Inter** for body text
- **JetBrains Mono** for code
- **Noto Sans JP** for Japanese text

### Default Theme

The app defaults to dark mode. To change this, modify `app/page.tsx`:

```typescript
const [isDark, setIsDark] = useState(false) // Change to false for light mode default
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHERMAP_API_KEY` | OpenWeatherMap API key | Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | Yes |

## 🐛 Troubleshooting

### Weather API Not Working
- Verify your OpenWeatherMap API key is correct
- Check if you've exceeded the free tier rate limits
- Ensure the location name is spelled correctly

### AI Chat Not Responding
- Verify your Google Gemini API key is valid
- Check browser console for errors
- Ensure you have internet connectivity

### Voice Input Not Working
- Ensure you're using HTTPS or localhost (required for Web Speech API)
- Grant microphone permissions in your browser
- Check if your browser supports Web Speech API

### Geolocation Not Working
- Grant location permissions in your browser
- Ensure you're using HTTPS or localhost
- Check browser console for permission errors

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

**Shubham Nagar**

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework

## 📄 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ using Next.js and TypeScript
