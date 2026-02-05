<p align="center">
  <img src="public/mafalia-logo-svg.svg" alt="Mafal-IA Logo" width="120" height="120" />
</p>

# Mafal-IA - Agentic WhatsApp Platform

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss" alt="TailwindCSS"></a>
  <a href="https://github.com/genkit-ai"><img src="https://img.shields.io/badge/AI-Genkit-4285F4?logo=google" alt="Google Genkit"></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma" alt="Prisma"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql" alt="PostgreSQL"></a>
</p>

Mafal-IA is a B2B, API-first platform for restaurants. It provides an intelligent WhatsApp AI Agent that automates customer interactions, order taking, and menu inquiries.

**Key Philosophy**: Strict, production-ready implementation. No "simulations" or fake data. The system relies on real AI services (Google Genkit) and real database records.

## Features

- **AI-Powered Conversations**: Built on Google Genkit (Gemini), detecting language (English, French, Wolof, Arabic) and intent.
- **Smart Menu Retrieval (RAG)**: Uses fuzzy search and vector embeddings (pgvector) to recommend relevant menu items.
- **Order Calculation**: Automatically parses natural language orders (`"2 burgers and a coke"`) and calculates totals.
- **Multi-Tenant**: Manage multiple restaurants under one platform.
- **WhatsApp Native**: Integrates with WhatsApp Business API (Meta) or LAM.
- **Strict API Usage**: Fails loudly if API keys are missing, ensuring configuration correctness.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Prisma ORM) with `pgvector` for semantic search.
- **AI**: Google Genkit (Gemini models).
- **Styling**: Tailwind CSS + ShadCN UI.
- **Deployment**: Vercel-ready (Serverless functions).

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon, Supabase, or local).
- Google AI API Key (for Genkit).
- WhatsApp Business API credentials (optional for testing via Simulator).

### Environment Variables

Copy `.env.example` to `.env` (or `.env.local`) and set the following:

```env
# Database configuration
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Google AI (Required for Chat)
GOOGLE_GENKIT_API_KEY="your-google-ai-api-key"

# WhatsApp Business API (Required for WhatsApp integration)
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_ACCESS_TOKEN="your-access-token"
WHATSAPP_VERIFY_TOKEN="your-verify-token"

# Admin Token (For securing admin overrides)
ADMIN_API_TOKEN="secret-admin-token"
```

### Installation

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/utachicodes/mafal-ia.git
    cd mafal-ia
    npm install --legacy-peer-deps
    ```

2.  **Database Setup**:
    ```bash
    # Generate Prisma client
    npx prisma generate

    # Push schema to database
    npx prisma db push
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build**:
    ```bash
    npm run build
    ```
    *Note: If you encounter build errors related to `DATABASE_URL` prerendering, ensure your pages are using `export const dynamic = "force-dynamic"`, especially `/restaurants`.*

## Testing the Agent

Since we removed simulation logic, you must have a valid `GOOGLE_GENKIT_API_KEY`.

1.  **Admin Simulator**:
    Navigate to `/restaurants/[id]`. Use the "Chat Simulator" to test the agent without sending real WhatsApp messages.

2.  **AI Playground**:
    Go to `/playground` for a standalone chat interface.

3.  **WhatsApp**:
    Configure the webhook in your Meta App Dashboard to point to `https://your-domain.com/api/whatsapp`.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── whatsapp/     # Webhook handler
│   │   ├── ai/           # AI endpoints
│   ├── restaurants/      # Restaurant management
├── ai/                   # Genkit flows (backend)
│   ├── flows/            # generate-response, calculate-order, etc.
├── lib/
│   ├── ai-client.ts      # Server-side AI client (Genkit wrapper)
│   ├── embeddings.ts     # Vector embedding & search logic
│   ├── whatsapp-client.ts# WhatsApp API wrapper
├── components/           # React components
```

## Deployment

The project is optimized for deployment on Vercel.

1.  Push to GitHub.
2.  Import project in Vercel.
3.  Set all **Environment Variables** in the Vercel dashboard.
4.  Deploy.

## contributing

Contributions are welcome! Please open an issue or PR for any improvements.
