# AI Multi-Channel Content Orchestrator

A full-stack application that automates multi-channel marketing content creation using AI. Input a topic and campaign details — the system runs a sequential AI pipeline to produce a complete, ready-to-distribute content pack.

---

## Overview

The orchestrator accepts campaign parameters, optionally scrapes an article URL for context, then runs six AI agents in sequence:

1. **Trend Analysis** — Fetches real-time signals via SerpAPI, scores momentum, and generates recommended angles.
2. **Brand Voice Profiling** — Derives tone, formality, CTA style, preferred/avoided words from campaign inputs and past content examples.
3. **Strategy Planning** — Builds a core angle, hooks, and per-channel strategy.
4. **Content Pack Generation** — Produces platform-native copy for TikTok, Facebook, Instagram, and X (Twitter).
5. **Image Prompt Generation** — Creates hero, product/service, and social image prompts.
6. **QA Review** — Reviews all outputs and flags issues before delivery.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TailwindCSS, TanStack Query, Framer Motion |
| Backend | Node.js, Express, TypeScript (ESM) |
| AI | Google Gemini (`gemini-2.5-flash`) via REST API |
| Trend Data | SerpAPI (Google Trends) |
| Validation | Zod |

---

## Project Structure

```
MultiChanel_Agents/
├── backend/
│   └── src/
│       ├── config/          # Environment config
│       ├── modules/
│       │   ├── ai/          # Gemini client + prompt templates
│       │   ├── analyze/     # Main orchestration service, controller, routes, schema, types
│       │   ├── brand-voice/ # Brand voice agent
│       │   ├── content/     # Content pack agent
│       │   ├── image-prompts/ # Image prompt agent
│       │   ├── qa/          # QA review agent
│       │   ├── strategy/    # Strategy agent
│       │   └── trends/      # Trend fetcher, scorer, service
│       ├── shared/          # HTTP helpers, error types, utilities
│       ├── app.ts           # Express app setup
│       └── server.ts        # Entry point
├── frontend/
│   └── src/
│       ├── app/             # Next.js app router pages (/, /generate, /results)
│       ├── components/
│       │   ├── form/        # CampaignForm
│       │   ├── layout/      # AppShell, Providers
│       │   ├── marketing/   # HeroSection, FeatureCards
│       │   ├── navigation/  # TopNav, Footer
│       │   ├── result/      # Result dashboard cards (trend, brand, strategy, content, QA...)
│       │   └── ui/          # Button, Input, Textarea, Badge, Panel, etc.
│       ├── hooks/           # useAnalyze, useCopyToClipboard
│       ├── lib/             # API client, result store, utils
│       └── types/           # API response types
└── package.json             # Root workspace scripts
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- A [SerpAPI key](https://serpapi.com/)

### 1. Clone and install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — copy `.env.example` to `.env` and fill in your keys:

```bash
cp backend/.env.example backend/.env
```

```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
REQUEST_TIMEOUT_MS=15000

AI_PROVIDER=gemini          # use "mock" to skip real AI calls
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_gemini_api_key

TREND_PROVIDER=serpapi       # use "mock" to skip real trend data
SERPAPI_API_KEY=your_serpapi_key
SERPAPI_TRENDS_TIMEFRAME=today 3-m
```

**Frontend** — copy `.env.local.example` to `.env.local`:

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 3. Run in development

From the project root:

```bash
# Start backend
npm run dev:backend

# Start frontend (in a separate terminal)
npm run dev:frontend
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

---

## API

### `POST /api/analyze`

Runs the full content orchestration pipeline.

**Request body:**

```json
{
  "topic": "string (2–160 chars)",
  "articleUrl": "string (optional URL)",
  "businessType": "string",
  "targetAudience": "string",
  "campaignGoal": "string",
  "region": "string",
  "brandTone": "string",
  "selectedChannels": ["TikTok", "Facebook", "Instagram", "X"],
  "pastBrandContent": ["optional array of past copy examples (max 10)"]
}
```

**Response:**

```json
{
  "topicSummary": "string",
  "trendReport": {
    "status": "rising | good-opportunity | evergreen | weak",
    "score": 0,
    "urgency": "string",
    "relatedKeywords": [],
    "recommendedAngles": [],
    "explanation": "string"
  },
  "brandVoice": {
    "tone": "string",
    "formality": "string",
    "sentenceStyle": "string",
    "ctaStyle": "string",
    "preferredWords": [],
    "avoidWords": []
  },
  "strategy": {
    "coreAngle": "string",
    "hooks": [],
    "channelStrategy": {}
  },
  "contentPack": {
    "tiktokScript": "string",
    "facebookPosts": [],
    "instagramCaption": "string",
    "twitterThread": []
  },
  "imagePrompts": [
    { "type": "hero | product-service | social", "prompt": "string" }
  ],
  "qa": {
    "status": "passed | needs-review",
    "notes": []
  }
}
```

---

## Scripts

From the project root:

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run dev:backend` | Start Express dev server with hot reload |
| `npm run build:frontend` | Build Next.js for production |
| `npm run build:backend` | Compile TypeScript backend |
| `npm run lint:frontend` | Type-check frontend |
| `npm run lint:backend` | Type-check backend |

---

## Mock Mode

Set `AI_PROVIDER=mock` and/or `TREND_PROVIDER=mock` in the backend `.env` to run the pipeline without making real API calls. The system will return fallback data — useful for UI development and testing.
