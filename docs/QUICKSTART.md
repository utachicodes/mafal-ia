# Mafal‑IA Quickstart (RAG‑based Chatbot)

This guide shows how to run locally, create a restaurant, get your chatbot endpoint, and test it. Then it covers deployment to Vercel.

## Prerequisites
- Node.js 18+
- SQLite for local dev (bundled)
- Optional (Prod): PostgreSQL URL
- Optional (Prod): GOOGLE_GENKIT_API_KEY set in Vercel for high‑quality embeddings

## Environment (local)
Create `.env.local` (or set in your shell):

```env
# Local SQLite (dev only)
DATABASE_URL="file:./dev.db"

# Enable demo shortcuts (optional)
DEMO_MODE=true

# Genkit key is not required locally; embeddings fallback is used
# GOOGLE_GENKIT_API_KEY=
```

Then sync Prisma and generate client:
```powershell
$env:DATABASE_URL = "file:./dev.db"
npx prisma db push
npx prisma generate
```

## Run the app
- Development: `npm run dev`
- Production local: `npm run build && npm run start`

Open http://localhost:3000

## Create a restaurant (two ways)

### A) Via UI
- Go to `Onboarding`.
- Fill: name, description, cuisine, business hours, delivery info, location, welcome message.
- Paste menu as JSON (array of items with name/price, etc.).
- Click Create. Copy the displayed `chatbotEndpoint`.

### B) Via API (PowerShell example)
```powershell
$create = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/onboarding/simple" `
  -ContentType "application/json" `
  -Body (@{
    name = "Chez Fatou"
    description = "Authentic Senegalese"
    cuisine = "Senegalese"
    businessHours = "Mon-Sun 10:00-22:00"
    deliveryInfo = "Deliveries 11:00-21:00 within 5km"
    location = "Dakar, Point E"
    welcomeMessage = "Welcome to Chez Fatou! How can I help?"
    orderingEnabled = $true
    menu = @(
      @{ name = "Thieboudienne"; description = "Rice & fish"; price = 3500; category = "Main" },
      @{ name = "Yassa Poulet"; price = 3000; category = "Main" }
    )
  } | ConvertTo-Json -Depth 5)

$endpoint = $create.chatbotEndpoint
$endpoint
```

## Test the chatbot endpoint
Use the full URL: `http://localhost:3000` + `chatbotEndpoint`.

```powershell
Invoke-RestMethod -Method Post `
  -Uri ("http://localhost:3000" + $endpoint) `
  -ContentType "application/json" `
  -Body '{"from":"+221771234567","text":"What are your hours and do you deliver to Point E?"}'
```

Try menu queries:
```powershell
# List burgers (name/category/description match)
Invoke-RestMethod -Method Post `
  -Uri ("http://localhost:3000" + $endpoint) `
  -ContentType "application/json" `
  -Body '{"from":"+221771234567","text":"Do you have burgers?"}'

# Recommendations from RAG retriever
Invoke-RestMethod -Method Post `
  -Uri ("http://localhost:3000" + $endpoint) `
  -ContentType "application/json" `
  -Body '{"from":"+221771234567","text":"recommend a chicken dish"}'
```

Expected replies include hours, delivery, location, and menu items. Menu recommendations use retrieval over stored embeddings (fallbacks locally).

Note: If you see a Prisma validation error about the datasource URL, ensure your env var is named exactly `DATABASE_URL` and starts with `file:` for SQLite, e.g. `file:./dev.db`.

## RAG: Embeddings & Retrieval
- On creation, each `MenuItem` gets an embedding (local deterministic fallback).
- Retrieval uses cosine similarity over `MenuItem.embedding` with lexical fallback.
- In Vercel (prod), set `GOOGLE_GENKIT_API_KEY` to enable Genkit embeddings for higher quality.

## Database & Migrations
- Local dev: SQLite at `file:./dev.db`.
- Production: use PostgreSQL, set `DATABASE_URL` in Vercel.
- Create and commit migrations before deploy:
  ```powershell
  npx prisma migrate dev --name init_rack_fields
  git add prisma/migrations
  git commit -m "chore(db): init rack fields migration"
  ```
- Vercel runs `npm run build` which invokes `prisma migrate deploy`.

## Deploy to Vercel
- Set env vars in Vercel Project Settings:
  - `DATABASE_URL` (Postgres)
  - `GOOGLE_GENKIT_API_KEY` (optional, recommended)
  - `DEMO_MODE=false`
- Build Command: `npm run build`
- Start Command: (managed by Vercel)

## Common issues
- "<!DOCTYPE ... is not valid JSON": you called a relative URL or used GET. Use absolute `http://localhost:3000/...` and POST with JSON.
- P2021 table not found: ensure `DATABASE_URL` points to the right DB, run `npx prisma db push`, and restart.
- Old restaurant ID: create a fresh one after restarts; use the returned endpoint immediately.

## Where to edit behavior
- API onboarding: `app/api/onboarding/simple/route.ts`
- Chatbot replies: `app/api/chatbots/[id]/messages/route.ts`
- Retrieval: `src/lib/retrieval.ts`
- Embeddings: `src/lib/embeddings.ts`
- Prisma schema: `prisma/schema.prisma`

That’s it—create a restaurant, copy the endpoint, POST messages, and get rack‑based answers. Deploy to Vercel when ready.
