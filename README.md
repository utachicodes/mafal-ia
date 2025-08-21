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
4. Initialize database with Prisma (PostgreSQL):
   - Generate client: `npx prisma generate`
   - Create schema and migrations: `npx prisma migrate dev --name init`
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
.
├─ app/                             # Next.js App Router
│  ├─ api/
│  │  ├─ whatsapp/route.ts          # WhatsApp webhook (GET verify, POST messages)
│  │  └─ restaurants/[id]/route.ts  # Restaurant API
│  ├─ analytics/page.tsx
│  ├─ restaurants/[id]/
│  ├─ restaurants/page.tsx
│  ├─ settings/page.tsx
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
│  │  ├─ ai-client.ts               # Server runner for flows
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

## Operational Notes

- __Rate limits:__ WhatsApp and Genkit have rate/usage limits; plan capacity accordingly.
- __Monitoring:__ Use your platform logs to monitor `/api/whatsapp` for errors.
- __Backups:__ Enable backups on your Postgres provider.

## Testing

The platform includes comprehensive integration testing:

- Restaurant data validation
- Menu item structure validation
- AI response generation testing
- WhatsApp message processing
- Webhook signature validation

Run tests using the Integration Test Panel in the settings.

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
