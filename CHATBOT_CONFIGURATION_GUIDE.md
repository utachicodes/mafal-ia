# Chatbot Configuration Guide

Miniane u can use this guide to set up a mock restaurant so the WhatsApp chatbot answers well: greetings, menu questions, delivery info, and orders.

## Requirements

- __Restaurant profile__: basic info used by `app/api/whatsapp/route.ts` and `RestaurantService`.
- __Menu items__: so the bot can answer prices and totals.
- __chatbotContext__: short instructions for tone and behavior.
- __Environment variables__: API keys for Genkit and WhatsApp.

## Set up your restaurant

Fill these fields for each restaurant:

- `name`: Restaurant name
- `shortDescription`: One-line description
- `whatsappPhoneNumberId`: must match the Meta `phone_number_id` in the webhook
- `location`:
  - `address`, `city`, `country`
- `businessHours`: e.g., `{"mon-fri":"10:00-22:00","sat":"10:00-23:00","sun":"12:00-20:00"}`
- `delivery`:
  - `supportsDelivery` (boolean)
  - Optional: `zones` (name/fee), `averageEtaMinutes`, `pickupAvailable`
- `menu`: list of items (see schema below)
- `chatbotContext`: tone/behavior (see examples)

These values are used in `app/api/whatsapp/route.ts` to build `restaurantContext`, which is sent to the AI flows through `src/lib/ai-client.ts`.

## Menu schema (minimal)

The bot needs a structured menu to answer and compute totals. Keep it simple.

```json
[
  {
    "id": "1",
    "name": "Thieboudienne",
    "description": "Traditional Senegalese rice and fish",
    "price": 3500,
    "category": "Main Course",
    "isAvailable": true
  },
  {
    "id": "2",
    "name": "Yassa Poulet",
    "description": "Chicken in onion-lemon sauce",
    "price": 3000,
    "category": "Main Course",
    "isAvailable": true
  }
]
```

Notes:
- `price`: integer in FCFA (or your currency’s minor unit)
- `isAvailable=false`: the bot won’t recommend the item
- You can validate/format with `src/lib/data-utils.ts`

## chatbotContext examples

Use this to set tone, languages, and rules.

Example: friendly multilingual assistant

```text
You are Mafal Bot, the helpful assistant for {{restaurantName}}.
- Greet in the user’s language (French, English, Wolof, Arabic) and keep responses concise.
- If the user greets ("Bonjour", "Salam"), greet back and offer help with menu, prices, delivery, or placing an order.
- If asked about items, suggest 2–3 popular options with prices.
- If an item is unavailable, propose similar available alternatives.
- For orders, confirm items, quantities, total price, and delivery/pickup preference.
- If the request is unclear, ask a short clarifying question.
```

Example: strict ordering workflow

```text
Role: Order-taker for {{restaurantName}}.
- Prioritize capturing order items and quantities.
- Always confirm availability and total with fees.
- Ask whether delivery or pickup; if delivery, ask address and phone.
- Be brief and professional.
```

## How it works

- `app/api/whatsapp/route.ts`
  - Verifies webhook and extracts text + `phone_number_id`.
  - Finds the restaurant with `RestaurantService.getRestaurantByPhoneNumber()`.
  - Builds `restaurantContext` (hours, delivery, location, fees, ETA).
  - Calls Genkit flows (via `AIClient`) with `chatbotContext`, `restaurantContext`, the user message, and recent history.
- `src/ai/flows/generate-response.ts`
  - Detects language and intent (greeting, menu, order, etc.).
  - Can call subflows (menu info, totals) and then writes the reply.
- `src/ai/config.ts`
  - Configures the model and validates `GOOGLE_GENKIT_API_KEY`.

## Setup checklist

1) In the dashboard, create a restaurant and set:
- Name, short description
- WhatsApp `whatsappPhoneNumberId` (must match Meta phone_number_id)
- Location and business hours
- Delivery settings (supportsDelivery, fees/zones, pickup)
- Paste/import a valid menu JSON (see above)
- Add a `chatbotContext`

2) Environment variables (`.env.local`):
- `GOOGLE_GENKIT_API_KEY`
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`
- Optional for DB mode: `DATABASE_URL`

3) Run locally:
- `npm run dev`
  

4) Link your Meta webhook to `/api/whatsapp` and verify using `WHATSAPP_VERIFY_TOKEN`.

## Test scenarios

- __Greeting__: send "Bonjour". Expect a friendly greeting + offer to help. If it apologizes:
  - Check restaurant is found for the incoming `phone_number_id`.
  - Ensure `chatbotContext` includes how to respond to greetings.
  - Ensure flows run server-side (no client import of `src/ai/flows/*`).
- __Menu question__: "Avez-vous du Thieb?" Expect item availability/price.
- __Order__: "Je veux 2 Thieb et 1 Yassa." Expect item extraction + total.
- __Delivery__: "Livrez-vous à Dakar Plateau?" Expect delivery/fees/ETA using `restaurantContext`.

## If "Bonjour" gets an apology

Common causes:
- No restaurant match: `whatsappPhoneNumberId` ≠ incoming `phone_number_id`.
- Empty/invalid menu: AI lacks context when conversation quickly involves items/prices.
- Weak/missing `chatbotContext`: the bot isn’t guided to handle simple greetings.
- Env/runtime errors: missing `GOOGLE_GENKIT_API_KEY`, bundling server deps in client, or flow exceptions; see server logs.
- Unsupported message types: stickers/images without text.

Fixes:
- Verify routing IDs and log inbound payload in `app/api/whatsapp/route.ts`.
- Provide a minimal but clear `chatbotContext` (see examples).
- Ensure at least a few valid menu items.
- Use `AIClient` for server-only flow execution; do not import `src/ai/flows/*` in client components.

## Env variables (quick ref)

- `GOOGLE_GENKIT_API_KEY`: required for AI flows (`src/ai/config.ts`).
- `WHATSAPP_ACCESS_TOKEN`: required to send replies (`src/lib/whatsapp-client.ts`).
- `WHATSAPP_APP_SECRET`: validates `X-Hub-Signature-256` (`src/lib/webhook-validator.ts`).
- `WHATSAPP_VERIFY_TOKEN`: used during webhook setup.
- `DATABASE_URL`: for Prisma/PostgreSQL.

Note: For production and normal testing, ensure `DEMO_MODE` is not set or is `false`.

## AI Evaluation Checklist (Pass/Fail)

Use this to verify the chatbot behaves like a production-ready restaurant assistant.

1) Greeting and Language
- Send: "Bonjour" → Pass if it greets politely in French and offers help.
- Send: "Salam" → Pass if it greets in Wolof or stays friendly/multilingual.

2) Menu Knowledge
- Ask: "Avez-vous du Thieb ?" → Pass if it returns availability and price or a close alternative if unavailable.
- Ask: "Montre-moi 3 plats populaires" → Pass if it lists 2–3 items with prices.

3) Order Flow
- Send: "Je veux 2 Thieb et 1 Yassa" → Pass if it extracts items/quantities and returns a total.
- When asked delivery/pickup, choose one → Pass if it confirms and summarizes before asking for final confirmation.

4) Operations & Policy
- Ask: "Vous êtes ouverts ?" outside business hours → Pass if it states closed and indicates next opening time.
- Ask: "Livrez-vous à Dakar Plateau ?" → Pass if it answers with delivery status, fee, ETA.

5) Robustness & Fallbacks
- Send an image or sticker → Pass if it replies with a polite fallback to send text.
- Force an error (temporarily unset API key) → Pass if it replies with a friendly retry message, not a crash.

If any item fails:
- Check routing (`phone_number_id`), env vars, and that menu items exist.
- Ensure `chatbotContext` is set (see examples) and avoid importing server flows in client code.

## Operational Defaults (Built-in)

To avoid blank prompts or missing guidance, the app provides safe defaults:
- In DB mode, restaurants missing `chatbotContext` fields are auto-filled by `RestaurantService.mapPrismaToRestaurant()` using defaults (welcome, hours, delivery info, behavior). See `src/lib/restaurant-service.ts`.
- `supportedLanguages` defaults to `["French", "English", "Wolof", "Arabic"]` if empty.

These defaults ensure greetings and basic Q&A work even if configuration is incomplete. Customize them per restaurant for best results.
