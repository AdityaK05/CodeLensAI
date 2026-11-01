# Technical Architecture Document

## 1. System Overview

**CodeLens AI** is architected as an edge-capable full-stack Next.js application designed for asynchronous, low-latency code understanding and static analysis. It decouples the client-side code editing environment from backend AI inference pipelines using HTTP streaming.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
│  ┌─────────────────────────┐            ┌────────────────────────────┐ │
│  │ Monaco Code Editor      │            │ AI Explanation Panel       │ │
│  │ Theme: Cream Latte      │            │ Theme: Midnight Plum       │ │
│  │ (#FAF2E8)               │            │ (#211426)                  │ │
│  └────────────┬────────────┘            └─────────────▲──────────────┘ │
│               │                                       │                │
│               │ Code + Task Payload                   │ Stream Chunks  │
│               ▼                                       │ (SSE)          │
└───────────────┼───────────────────────────────────────┼────────────────┘
                │                                       │
                ▼                                       │
┌───────────────────────────────────────────────────────┼────────────────┐
│                             NEXT.JS SERVER            │                │
│  ┌────────────────────────────────────────────────────┴─────────────┐  │
│  │ POST /api/analyze (App Router Edge / Server Handler)              │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Zod Input Validation & Rate Limiter                              │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ AI Router & Key Verifier                                         │  │
│  │ - Probes primary API key with fast timeout                       │  │
│  │ - Seamless auto-failover if quota / invalid key detected         │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                   ┌─────────────────┴─────────────────┐                │
│                   ▼                                   ▼                │
│       ┌───────────────────────┐           ┌───────────────────────┐    │
│       │ Google Generative AI  │           │ Groq High-Speed LPU   │    │
│       │ (@ai-sdk/google)      │           │ (@ai-sdk/openai)      │    │
│       └───────────────────────┘           └───────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### 2.1 Aesthetic & Design System
- **Midnight Plum (`#211426`)**: Dominates chrome, panels, headers, dialogs, and navigation.
- **Rose Gold (`#C99591`)**: Serves as the primary functional accent (buttons, icons, active pills).
- **Cream Latte (`#FAF2E8`)**: Houses the Monaco Editor canvas, paired with rich Mocha Brown syntax highlighting to eliminate eye fatigue during extended coding sessions.

### 2.2 Monaco Editor Component
- Dynamically imported with `{ ssr: false }` to prevent SSR window reference conflicts.
- Houses custom `cream-latte-theme` mapping tokens to warm mocha colors.
- Exposes imperative handles via `useImperativeHandle` for document formatting, snippet injection, and document extraction.

### 2.3 Resilient AI Provider Layer
- Integrates both Google Generative AI and OpenAI-compatible Groq runtime engines.
- Performs non-blocking health checks before stream generation. If primary credentials report an invalid key or quota exhaustion, it routes automatically to the secondary engine without user disruption.

### 2.4 Streaming Protocol
- Employs Server-Sent Events (SSE) via `ReadableStreamDefaultReader` on the frontend and `toTextStreamResponse()` on the backend.
- Prevents timeout issues on lengthy algorithmic responses and provides immediate token feedback to the user.

### 2.5 Persistence & Privacy
- **Client-Side State**: Analysis sessions are persisted to `localStorage` under `codelens_history_v1`.
- **Anonymized Models**: UI displays generic "AI Engine" indicators, preventing underlying model strings from surfacing to the user.
