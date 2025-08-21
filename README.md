# Mafal-IA - Restaurant WhatsApp Chatbot Platform

A comprehensive SaaS platform that allows restaurant owners to create, manage, and deploy intelligent, multilingual WhatsApp chatbots for their business.

## Features

- **Intelligent AI Chatbots**: Powered by Google Genkit with advanced language detection and intent recognition
- **Multilingual Support**: Automatic language detection and response in French, English, Wolof, and Arabic
- **Menu Management**: Easy-to-use interface for managing restaurant menus and pricing
- **Order Processing**: AI-powered order calculation and total computation
- **WhatsApp Integration**: Seamless integration with WhatsApp Business API
- **Real-time Testing**: Live chat interface for testing chatbot responses
- **Analytics Dashboard**: Comprehensive analytics and conversation insights
- **Restaurant Management**: Multi-restaurant support with individual configurations

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

\`\`\`
src/
├── ai/                     # Genkit AI flows and tools
│   ├── flows/             # AI conversation flows
│   └── config.ts          # AI configuration
├── components/            # React components
│   ├── restaurant/        # Restaurant-specific components
│   └── ui/               # ShadCN UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
└── app/                  # Next.js app router pages
\`\`\`

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

## How Restaurants Use This API (What We Provide vs. You Do)

- __What this app provides__
  - WhatsApp webhook endpoint: `GET/POST /api/whatsapp`
  - AI conversation orchestration using Genkit (LLM, tools, menu reasoning)
  - Restaurant/menu data storage and retrieval
  - Conversation logging and basic analytics UI

- __What your restaurant handles__
  - Payment collection and refunds (outside WhatsApp API scope)
  - Delivery/pickup logistics and order fulfillment
  - Customer support escalation beyond the AI chat
  - Menu accuracy, pricing, taxes, and legal compliance

In short, this platform exposes an API that turns incoming WhatsApp messages into smart AI replies using your menu/context. You operate the business workflow.

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

For support and questions, please contact: support@mafal-ia.com
