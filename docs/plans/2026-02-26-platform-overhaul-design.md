# Platform Overhaul Design — 2026-02-26

## Scope

Five coordinated changes to the Mafal-IA platform:

1. Global `restaurant` → `business` rename (DB schema + code + UI)
2. Dark mode flash fix
3. RAG knowledge base (doc ingestion per business)
4. Webhook consolidation (`/api/webhook/whatsapp`)
5. UI audit and polish

---

## 1. Restaurant → Business Full Rename

### DB
- Rename Prisma model `Restaurant` → `Business`, add `@@map("Business")`
- Rename `MenuItem.restaurantId` → `MenuItem.businessId`
- Rename `Conversation.restaurantId` → `Conversation.businessId`
- Rename `Order.restaurantId` → `Order.businessId`
- Rename `MessageLog.restaurantId` → `MessageLog.businessId`
- Update all `@relation` references on `User` model

### Code
- Rename `src/lib/restaurant-service.ts` → `src/lib/business-service.ts`
- Rename all TypeScript types `Restaurant` → `Business`, `restaurantId` → `businessId`
- Rename API route folders: `/api/restaurants/` → `/api/businesses/`, `/api/admin/restaurants/` → `/api/admin/businesses/`
- Update all imports, function names, variable names across the codebase
- Update all 120 tests

### UI
- Replace every user-facing string: "Restaurant" → "Business", "Restaurants" → "Businesses"
- Update placeholders, headings, breadcrumbs, empty states, error messages

---

## 2. Dark Mode Flash Fix

### Root cause
`ThemeProvider` wraps children in `<>{children}</>` before `mounted` state is true, so on first paint there is no `.dark` class → flash.

### Fix
- Remove the `mounted` guard from `ThemeProvider` — always render `<NextThemesProvider>`
- Add `suppressHydrationWarning` to the `<html>` element in `src/app/layout.tsx`
- Optionally set `storageKey="mafal-theme"` for explicit localStorage key

---

## 3. RAG Knowledge Base

### New Prisma models

```prisma
model KnowledgeDoc {
  id          String           @id @default(cuid())
  businessId  String
  business    Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)
  filename    String
  mimeType    String
  contentText String           // full extracted text
  chunks      KnowledgeChunk[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  @@index([businessId])
}

model KnowledgeChunk {
  id          String       @id @default(cuid())
  docId       String
  doc         KnowledgeDoc @relation(fields: [docId], references: [id], onDelete: Cascade)
  businessId  String
  content     String
  embedding   Json?
  chunkIndex  Int
  createdAt   DateTime     @default(now())
  @@index([businessId])
}
```

### Ingestion pipeline

`POST /api/businesses/[id]/knowledge` (multipart/form-data, field: `file`)

1. Validate file type (PDF, TXT, MD)
2. Extract text: `pdf-parse` for PDF; `Buffer.toString('utf-8')` for TXT/MD
3. Chunk: split into ~500-character chunks with 50-character overlap
4. Embed each chunk via existing `getEmbedding()` in `src/lib/embeddings.ts`
5. Save `KnowledgeDoc` + `KnowledgeChunk[]` in a Prisma transaction

Additional routes:
- `GET /api/businesses/[id]/knowledge` — list docs (id, filename, createdAt, chunkCount)
- `DELETE /api/businesses/[id]/knowledge/[docId]` — delete doc + cascade chunks

### Retrieval function

`src/lib/retrieval.ts` — new export:

```ts
retrieveKnowledge(businessId: string, query: string, k = 3): Promise<RetrievedChunk[]>
```

Same cosine-similarity logic as `retrieveMenuItems`, but over `KnowledgeChunk` records.

### Chatbot integration

In `src/lib/webhook-processor.ts` (and `src/lib/ai-client.ts`):
- After existing menu RAG call, call `retrieveKnowledge(businessId, query)`
- Append retrieved chunks as additional context to the LLM prompt

### Dashboard UI

New page: `/dashboard/businesses/[id]/knowledge`
- File upload dropzone (PDF, TXT, MD)
- List of uploaded docs with delete button
- Upload progress indicator

---

## 4. Webhook Consolidation

### Remove
- `src/app/api/whatsapp/route.ts`
- `src/app/api/webhooks/lam/[id]/route.ts`

### New endpoint: `src/app/api/webhook/whatsapp/route.ts`

**GET** — verification:
- Checks `hub.challenge` (Meta format)
- Checks `challenge` param (LAM format)
- Returns challenge value as plain text

**POST** — inbound message:
- Detects format by payload shape:
  - Meta: `body.object === "whatsapp_business_account"` or `body.entry[*].changes[*].value.messages`
  - LAM: `body.from` or `body.message.from` present
- Meta path: HMAC-SHA256 signature check on `x-hub-signature-256`, then extract message, look up business by `whatsappPhoneNumberId`
- LAM path: extract `from`, `text`, `id` from payload; look up business by `whatsappNumber` matching `from`'s WABA context or use `LAM_WABA_ID` env
- Both paths call `processUnifiedMessage(businessId, phoneNumber, messageId, text, metadata)`

### New env vars (`.env.example`)
```
LAM_WABA_ID=225657934082084
```
(`LAM_API_KEY` and `LAM_API_BASE_URL` already documented.)

---

## 5. UI Audit

- Fix all `text-blue-*` / `text-purple-*` brand color violations → `text-primary`
- Audit dashboard layout for broken grids, overflow issues
- Ensure all pages render correctly in both light and dark mode
- Fix any inconsistent spacing, typography, or component states

---

## Decisions

| Decision | Choice |
|---|---|
| DB schema rename | Full Prisma model rename + migration |
| Doc storage | DB as text content (no binary blobs) |
| Webhook path | Replace existing, single `/api/webhook/whatsapp` |
| Chunk size | ~500 chars with 50-char overlap |
| Embedding | Reuse existing `getEmbedding()` (Google AI + fallback) |
