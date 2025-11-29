# 🔗 HackaLink - Hackathon Networking Assistant

**Find your dream team, discover who to network with, and generate personalized talking points.**

A powerful AI-driven application that helps you maximize your hackathon networking experience by analyzing participant data, identifying influential people to connect with, and providing personalized conversation starters.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)

## ✨ Features

### 🎯 Heavy Hitters Detection
Identify the most influential participants based on their professional background, company prestige, and career achievements.

### 💬 Personalized Talking Points
Get AI-generated conversation starters tailored to each person's background, interests, and experience.

### 👥 Team Builder
Find complementary teammates with matching skills and diverse backgrounds for the perfect hackathon team.

### 🔍 Profile Discovery
Automatically find and enrich LinkedIn profiles for all participants using SerpAPI.

### 📊 Smart Rankings
See participants ranked by influence score, similarity to your background, and team fit.

### 📝 LinkedIn Post Generator
Create professional posts about your hackathon experience to share with your network.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- SerpAPI key (for LinkedIn profile discovery)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hackalink.git
cd hackalink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# SerpAPI (for LinkedIn profile discovery)
SERPAPI_API_KEY=your_serpapi_api_key

# Stack Auth (optional)
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_client_key
STACK_SECRET_SERVER_KEY=your_server_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── participants/  # Participant analysis endpoint
│   │   └── linkedin-post/ # Post generation endpoint
│   ├── dashboard/         # Main analysis dashboard
│   ├── participants/      # Participant list view
│   ├── teams/            # Team builder page
│   └── post/             # LinkedIn post generator
├── components/
│   ├── analysis/         # Analysis result components
│   ├── layout/           # Layout components (Sidebar, PageHeader)
│   ├── participants/     # Participant-related components
│   ├── linkedin/         # LinkedIn post components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── llm-client.ts     # OpenAI integration
│   ├── linkedin-scraper-legal.ts  # SerpAPI integration
│   ├── rate-limiter.ts   # API rate limiting
│   └── services/         # Business logic services
└── types/                # TypeScript type definitions
```

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with gradient accents
- **Dark Sidebar**: Persistent navigation with active state indicators
- **Profile Avatars**: Display LinkedIn photos or colorful initials
- **Rank Badges**: Gold, silver, bronze badges for top participants
- **Animated Progress**: Real-time progress tracking during analysis
- **Responsive Layout**: Works on desktop and tablet devices

## 🔒 Legal & Privacy

This application uses legal methods for LinkedIn data access:
- **SerpAPI**: Searches Google for publicly available LinkedIn profile information
- **Manual Input**: Users can provide LinkedIn profile URLs directly
- **Rate Limiting**: Respects API rate limits to avoid issues

No direct scraping of LinkedIn is performed.

## 📄 License

MIT License - feel free to use this project for your own hackathons!

## 🙏 Acknowledgments

- Built for Thanksgiving Hackathon 2025 🦃
- Powered by OpenAI GPT-4o
- LinkedIn profile discovery via SerpAPI
