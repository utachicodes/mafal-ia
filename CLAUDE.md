# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mafal-IA is a B2B2C SaaS platform that powers WhatsApp restaurant chatbots with RAG-based menu search, order management, and multi-language support. It is built as a Next.js fullstack app with AI-powered conversation flows.

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint via next lint

# Testing
npm test             # Run all tests (Vitest)
npm run test:watch   # Watch mode

# Database
npx prisma generate           # Regenerate Prisma client
npx prisma db push            # Push schema changes (dev)
npm run migrate:deploy        # Run migrations (prod)
npm run migrate:status        # Check migration status
npx prisma studio             # Open Prisma Studio UI
```

## Architecture

### Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Shadcn UI (Radix primitives)
- **State:** Zustand v5, NextAuth.js v4 (JWT strategy)
- **AI:** Genkit v1 (Google AI embeddings `textEmbedding004`) + Groq SDK (LLM inference)
- **Database:** Prisma ORM — SQLite for dev, PostgreSQL for prod
- **Messaging:** Meta WhatsApp Business API + L'Africa Mobile (LAM) provider

### Directory Structure
```
src/
├── app/
│   ├── api/          # All REST endpoints (Next.js route handlers)
│   ├── dashboard/    # Dashboard pages (restaurant mgmt, orders, analytics)
│   ├── auth/         # Sign-in page
│   └── onboarding/   # Restaurant setup flow
├── ai/
│   ├── config.ts     # Genkit + model init (Groq, Google AI embeddings)
│   ├── flows/        # Genkit flows: generateResponse, getMenuItemInformation, calculateOrderTotal
│   └── index.ts      # Flow exports
├── lib/
│   ├── db.ts                 # Prisma client (lazy-loaded, Vercel-safe)
│   ├── auth.ts               # NextAuth configuration
│   ├── restaurant-service.ts # Core business logic
│   ├── embeddings.ts         # Vector embeddings with bag-of-words fallback
│   ├── retrieval.ts          # RAG cosine-similarity menu search
│   ├── llm.ts                # Groq LLM client
│   ├── whatsapp-client.ts    # Meta + LAM API clients
│   ├── webhook-processor.ts  # Inbound message orchestration
│   └── api-key.ts            # API key generation (mafalia_sk_* prefix + SHA256)
├── components/
│   ├── ui/           # Shadcn UI primitives
│   └── ...           # Feature components
└── context/          # React context (i18n language, user)
```

### AI / Message Pipeline
Inbound WhatsApp message → `webhook-processor.ts` → RestaurantService (lookup) → ConversationManager (history) → Groq (language detection + intent) → RAG retrieval (`retrieval.ts`) → Genkit flow (`generateResponseFlow`) → WhatsAppClient.sendMessage()

The embeddings pipeline uses Google AI `textEmbedding004` with a deterministic bag-of-words hash as a fallback when `GOOGLE_GENKIT_API_KEY` is unavailable.

### Authentication
- **Dashboard users:** NextAuth JWT credentials provider (bcrypt password hashing). JWT claims include `id`, `role` (`ADMIN` | `RESTAURANT_OWNER`), `plan` (`STANDARD` | `PREMIUM`).
- **Programmatic API access:** `mafalia_sk_*` API keys stored as SHA256 hashes in `Restaurant.apiKeyHash`.
- Dashboard routes redirect to `/auth/signin` when unauthenticated.

### Database Schema (Key Models)
- `User` — platform accounts with roles/plans
- `Restaurant` — core entity; holds WhatsApp credentials, LAM credentials, menu items, conversations
- `MenuItem` — includes `embedding` (JSON float array) for vector search
- `Conversation` — message history + order state as JSON, indexed by `(restaurantId, phoneNumber)`
- `Order` — line items as JSON, status lifecycle (pending → confirmed → preparing → delivered | cancelled)
- `MessageLog` / `SystemLog` — audit trail and app logs

### API Route Conventions
- Admin routes: `/api/admin/restaurants/[id]/*`
- Chatbot endpoint: `POST /api/chatbots/[id]/messages` — accepts `{ from: string, text: string }`
- WhatsApp webhook: `GET /api/whatsapp` (verification) + `POST /api/whatsapp` (inbound)
- LAM webhook: `POST /api/webhooks/lam/[id]`

### Styling
- Tailwind CSS v4 with CSS variables for theming
- Glassmorphism system: `backdrop-blur`, transparency layers, radial gradients
- Primary color: orange/crimson `HSL(25 85% 45%)`
- Font: Geist (loaded via `next/font`)

## Required Environment Variables

```
DATABASE_URL          # SQLite (file:./prisma/dev.db) or PostgreSQL
NEXTAUTH_SECRET       # JWT signing secret
GROQ_API_KEY          # LLM inference (required for AI flows)
GOOGLE_GENKIT_API_KEY # Embeddings (optional, fallback available)
WHATSAPP_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_APP_SECRET
WHATSAPP_VERIFY_TOKEN
ADMIN_API_TOKEN       # Privileged admin endpoints
LAM_API_KEY           # L'Africa Mobile (optional)
LAM_API_BASE_URL      # Defaults to https://waba.lafricamobile.com
```

## Key Docs

- `CHATBOT_CONFIGURATION_GUIDE.md` — restaurant setup, menu schema, webhook integration, test scenarios
- `docs/QUICKSTART.md` — local setup, DB setup, chatbot testing, Vercel deployment
