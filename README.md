# Mafal-IA - Restaurant WhatsApp Chatbot Platform

Mafal-IA is a B2B, API-first platform for restaurants. You pay for the service, we provide the WhatsApp AI API and a simple dashboard. Plug it into your existing workflows to answer customers, share menus, and calculate orders automatically.

## Features

- **AI that understands your customers**: Built on Google Genkit (Gemini), detects language and intent.
- **Speaks your customers’ language**: French, English, Wolof, Arabic (auto-detected).
- **Menu-aware**: Keep your menu in sync; the AI answers from your data.
- **Order math included**: Extracts items/quantities and computes totals.
- **WhatsApp-native**: Works with the WhatsApp Business API you already use.
- **Test and monitor**: Live testing and basic analytics in the dashboard.
- **Multi-restaurant ready**: Manage multiple brands under one account.

## Noo ngi fi pour jàppal
Your intelligent WhatsApp assistant. Get started in minutes.

1. **Create Your Restaurant**
   Add your restaurant profile: name, short description, and plan.

2. **Upload Your Menu**
   Upload a JSON file or paste items. We parse names, descriptions, and prices for the AI.

3. **Get Your API Key**
   Copy your unique API key and connect your WhatsApp Business account. Your assistant is ready to serve.

## V2 Update (Aug 2025)

- **New pages & flows**: `app/onboarding`, `app/playground`, `app/concierge`, `app/whatsapp/quick-connect`, and `app/legal/dpa`.
- **Concierge mode**: `Restaurant.isConcierge` lets one number act as a global concierge across all restaurants.
- **Browser-safe AI client**: Use `src/lib/ai-client-browser.ts` in client components; keep `src/lib/ai-client.ts` for server code only.
- **Local dev DB**: Default to SQLite via `prisma/dev.db` (PostgreSQL recommended for production).

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **AI Backend**: Google Genkit
- **State Management**: React Context and Hooks
- **Data Storage**: Prisma ORM + PostgreSQL (production), SQLite (local dev)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google AI API Key (for Genkit)
- WhatsApp Business API credentials

### Environment Variables (Production)

Create environment variables with the following keys (locally and in your hosting provider):

```env
# Database (PostgreSQL in production)
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=YOUR_META_WHATSAPP_ACCESS_TOKEN
WHATSAPP_APP_SECRET=YOUR_META_APP_SECRET
WHATSAPP_VERIFY_TOKEN=YOUR_CHOSEN_VERIFY_TOKEN

# Genkit / Google AI
GOOGLE_GENKIT_API_KEY=YOUR_GOOGLE_API_KEY

# App mode
DEMO_MODE=false
```

### Installation

1. Clone the repository
2. Install dependencies (React 19 peer-deps note):
   - `npm install --legacy-peer-deps`
   - Optionally set globally: `npm config set legacy-peer-deps true`
3. Set up environment variables (`.env.local`)
4. Initialize database with Prisma
   - Local dev (SQLite, no DATABASE_URL needed):
     - `npx prisma migrate dev --name add-isConcierge`
     - `npx prisma generate`
   - Production (PostgreSQL):
     - Ensure `DATABASE_URL` is set
     - `npx prisma migrate deploy`
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
.
├─ app/                             # Next.js App Router
│  ├─ api/
│  │  ├─ whatsapp/route.ts          # WhatsApp webhook (GET verify, POST messages)
│  │  ├─ restaurants/[id]/route.ts  # Restaurant API
│  │  └─ concierge/order/route.ts   # Concierge ordering endpoint
│  ├─ analytics/page.tsx
│  ├─ concierge/page.tsx
│  ├─ onboarding/page.tsx
│  ├─ playground/page.tsx
│  ├─ restaurants/[id]/
│  ├─ restaurants/page.tsx
│  ├─ settings/page.tsx
│  ├─ whatsapp/quick-connect/page.tsx
│  ├─ legal/dpa/page.tsx
│  ├─ page.tsx                      # Landing page
│  └─ layout.tsx
│
├─ components/
│  ├─ ui/                           # ShadCN UI components
│  └─ theme-provider.tsx
│
├─ prisma/
│  ├─ schema.prisma                 # Postgres models
│  └─ dev.db                        # Local SQLite (dev only)
│
├─ public/                          # Static assets (logos, images)
│  └─ ...
│
├─ src/
│  ├─ ai/
│  │  ├─ flows/                     # Genkit flows (generate, menu info, totals)
│  │  ├─ config.ts
│  │  └─ index.ts                   # Flow registry
│  ├─ components/restaurant/        # Dashboard components
│  ├─ hooks/
│  │  └─ use-restaurants.tsx
│  ├─ lib/
│  │  ├─ ai-client.ts               # Server runner for flows (server-only)
│  │  ├─ ai-client-browser.ts       # Browser-safe client for client components
│  │  ├─ conversation-manager.ts    # In-memory conv + metadata (name/location/delivery)
│  │  ├─ data-utils.ts
│  │  ├─ delivery.ts                # Delivery zone fee/ETA estimator
│  │  └─ ... other utils
│  └─ ...
│
├─ styles/
│  └─ globals.css
│
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
└─ README.md
```

## Key Components

### AI Flows
- **Generate Response**: Main conversational AI flow
- **Menu Information**: RAG tool for menu queries
- **Order Calculator**: Order total computation
- **Menu Processor**: JSON menu parsing

### Dashboard Features
- Restaurant management and configuration
- Menu item management with JSON import
- Live chat testing interface
- API credentials management
- Analytics and reporting

### WhatsApp Integration
- Webhook verification and message processing
- Automatic AI response generation
- Conversation history management
- Multi-language support

## API Endpoints

- `GET /api/whatsapp` - Webhook verification
- `POST /api/whatsapp` - Message processing

## Quick API Usage

- **Verify webhook (Meta setup)**

```bash
curl -G \
  "https://your-domain.com/api/whatsapp" \
  --data-urlencode "hub.mode=subscribe" \
  --data-urlencode "hub.verify_token=$WHATSAPP_VERIFY_TOKEN" \
  --data-urlencode "hub.challenge=12345"
```

- **Send an inbound message (simulate WhatsApp event)**

```bash
curl -X POST "https://your-domain.com/api/whatsapp" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "metadata": { "phone_number_id": "YOUR_META_PHONE_NUMBER_ID" },
          "messages": [{
            "from": "221771234567",
            "id": "wamid.HBgNN...",
            "timestamp": "1699999999",
            "type": "text",
            "text": { "body": "Bonjour, avez-vous du Thieb?" }
          }]
        }
      }]
    }]
  }'
```

If `Restaurant.whatsappPhoneNumberId` matches the Meta `phone_number_id`, the request is routed to your restaurant. Mafal-IA generates a reply and sends it via the WhatsApp Business API.

## B2B Model: What We Provide vs What You Handle

We provide the API and tools. You keep control of your operations.

- __What we provide__
  - A production-ready WhatsApp webhook: `GET/POST /api/whatsapp`
  - AI conversation engine (intent, language, menu reasoning, order extraction)
  - Secure storage for restaurant/menu data
  - Basic analytics and a simple dashboard

- __What you handle__
  - Payments and refunds (outside the WhatsApp API scope)
  - Delivery/pickup logistics and fulfillment
  - Customer support escalation beyond the AI
  - Menu accuracy, pricing, taxes, compliance

In short: you pay for Mafal-IA, we provide the WhatsApp AI API + dashboard. Incoming WhatsApp messages become smart, menu-aware replies. You keep control of fulfillment and payments.

## Production Setup Checklist

1. __Provision PostgreSQL__ (Neon/Supabase/AWS RDS) and set `DATABASE_URL`.
2. __WhatsApp Business API__
   - Get `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET` from Meta.
   - Choose a `WHATSAPP_VERIFY_TOKEN`.
3. __Google Genkit__
   - Set `GOOGLE_GENKIT_API_KEY`.
4. __Run Prisma__
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
5. __Set your restaurant’s WhatsApp phone_number_id__ in DB
   - `npx prisma studio` → Restaurant → set `whatsappPhoneNumberId` to Meta phone_number_id
6. __Deploy__ and set the same env vars in your hosting provider.

## Webhook Contract (WhatsApp)

- __Verification:__
  - `GET /api/whatsapp?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...`
  - Returns `200` with `hub.challenge` if `hub.verify_token` matches `WHATSAPP_VERIFY_TOKEN`.

- __Message handling:__
  - `POST /api/whatsapp` with the standard WhatsApp inbound payload.
  - The service reads `entry[0].changes[0].value.metadata.phone_number_id` to identify which restaurant to route to.
  - It generates an AI reply and responds via WhatsApp Business API using your `WHATSAPP_ACCESS_TOKEN`.

Ensure the database field `Restaurant.whatsappPhoneNumberId` matches your Meta `phone_number_id` for correct routing.

## Menu JSON Schema (for AI reasoning)

Your menu is stored as structured items. A minimal shape:

```json
[
  {
    "id": "1",
    "name": "Thieboudienne",
    "description": "Traditional Senegalese rice and fish",
    "price": 3500,
    "category": "Main Course",
    "isAvailable": true
  }
]
```

You can import or edit menus via the dashboard UI. The AI uses this data to answer questions and compute totals.

## Security Notes

- __Rotate keys__ if exposed and store secrets only in environment variables.
- __Verify signatures:__ The webhook validates `X-Hub-Signature-256` using `WHATSAPP_APP_SECRET`.
- __Least privilege:__ Use a dedicated Postgres user for this app.

## Testing

The platform includes comprehensive integration testing:

- Restaurant data validation
- Menu item structure validation
- AI response generation testing
- WhatsApp message processing
  - Webhook signature validation

Run tests using the Integration Test Panel in the settings.

## Troubleshooting & Debugging

Use these targeted checks when things go wrong.

### NPM install / build
- __Peer deps (React 19 / Next 15)__: `npm install --legacy-peer-deps` (optionally `npm config set legacy-peer-deps true`).
- __Corrupt install__: delete `node_modules` + `package-lock.json`, then reinstall.
- __Node version__: use Node 18+ LTS. `node -v`.

### Next.js runtime & bundling
- __Edge vs Node mismatch__: API routes like `app/api/whatsapp/route.ts` should run on Node (don’t export `runtime = 'edge'`).
- __ESM/CJS errors (ERR_REQUIRE_ESM / Unexpected token 'export')__: avoid mixing module systems; keep Next defaults. Ensure `package.json` `type` and TS config align.
- __Client bundle pulling server deps__: don’t import `src/ai/flows/*`, `RestaurantService`, or other server libs in client components. Use `src/lib/ai-client-browser.ts` in client code and keep `src/lib/ai-client.ts` on the server.

### Environment / .env
- __Missing keys__: set `GOOGLE_GENKIT_API_KEY`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `DATABASE_URL` (when using DB). See `src/lib/env.ts`.
- __Wrong values__: compare with your Meta app settings and Google API key. Restart dev server after changes.

### WhatsApp webhook
- __GET verify returns 403__: `WHATSAPP_VERIFY_TOKEN` must match Meta’s configured token. Endpoint: `GET /api/whatsapp`.
- __403 signature mismatch__: `WHATSAPP_APP_SECRET` missing/incorrect; see `src/lib/webhook-validator.ts`.
- __400/401 from Graph API__: check `WHATSAPP_ACCESS_TOKEN`, `businessPhoneNumberId`, and message payload structure in `src/lib/whatsapp-client.ts`.
- __405/CORS issues locally__: use the exact GET or POST method as required; ensure correct `Content-Type: application/json`.

### Genkit / AI
- __Missing API key__: set `GOOGLE_GENKIT_API_KEY`.
- __429 rate limit / 5xx__: retry with backoff; temporarily switch model in `src/ai/config.ts` (e.g., `gemini-1.5-flash`).
- __Flow runtime errors (dynamic import)__: confirm flows are only executed server-side via `AIClient`.
- __Timeouts__: reduce prompt size, or increase platform timeout where applicable.

### AI response quality
- __No menu context__: ensure your restaurant has menu items; update via dashboard.
- __Missing business info__: verify `restaurantContext` passed in `app/api/whatsapp/route.ts` (hours, delivery, location, fees).
- __Tone/behavior__: customize `chatbotContext` in your restaurant data to guide tone and content.

### Prisma / Database
- __Migration errors__: run `npx prisma generate` then `npx prisma migrate dev --name init`. Verify `DATABASE_URL`.
- __SQLite lock on Windows__: close other processes touching the DB; delete `prisma/dev.db` for a clean dev reset if needed.

### Firebase-related "Module not found: Can't resolve 'net'" during build
- __Symptom__: import trace shows `firebase-admin` / `firebase-functions`; bundler complains about Node built-ins like `net`.
- __Cause__: optional Firebase providers from a transitive dep end up in a client/edge bundle or are recorded in `package-lock.json`.
- __Fixes__:
  - Keep API routes on Node runtime; don’t import server-only code in client components.
  - Avoid adding `@genkit-ai/firebase` or Firebase SDKs unless used server-side only.
  - Clean reinstall: delete `node_modules` and `package-lock.json`, then `npm install --legacy-peer-deps`.
  - Use `AIClient` to invoke flows; do not import `src/ai/flows/*` directly in client code.
  - As a last resort, set `DEMO_MODE=true` to validate UI and routing only.

### Dev server / OS
- __EADDRINUSE: 3000__: another app uses the port. Stop it or run with `PORT=3001 npm run dev`.
- __CERT_HAS_EXPIRED / TLS__: ensure system time is correct; use valid HTTPS certs in production.

### Quick diagnostics
- __Find who depends on X__: `npx why <pkg>`; tree: `npm ls <pkg>`.
- __Verbose logs__: check terminal during `npm run dev`. Add targeted `console.log` in `app/api/whatsapp/route.ts` to trace payload and routing.

## Deployment

1. Deploy to Vercel or your preferred platform
2. Configure environment variables
3. Set up WhatsApp webhook URL: `https://your-domain.com/api/whatsapp`
4. Configure WhatsApp Business API with your webhook

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact: abdoullahaljersi@gmail.com

Built with ❤️ by utachicodes.



