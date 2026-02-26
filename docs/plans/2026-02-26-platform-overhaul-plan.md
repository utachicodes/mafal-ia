# Platform Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename restaurant→business throughout the entire codebase (including DB), fix dark mode flash, add per-business RAG knowledge base with document ingestion, consolidate webhooks into a single endpoint, and polish the UI.

**Architecture:** The rename touches 67+ files via Prisma model rename + global sed replacement. The knowledge base adds two new Prisma models (KnowledgeDoc, KnowledgeChunk) and a new retrieval function that integrates with the existing webhook pipeline. The webhook consolidation replaces two existing route handlers with one unified `/api/webhook/whatsapp` endpoint.

**Tech Stack:** Next.js 15 App Router, Prisma ORM (PostgreSQL), Anthropic Claude SDK, `pdf-parse` (already installed), `next-themes`, Tailwind CSS v4, Vitest

---

## Task 1: Fix Dark Mode Flash

**Files:**
- Modify: `src/components/providers.tsx`
- Modify: `src/components/theme-provider.tsx`

**Problem:** `Providers` conditionally omits `<ThemeProvider>` on first render (before `mounted` is true), causing a flash of unstyled/wrong-theme content. `ThemeProvider` also has its own `mounted` guard. `layout.tsx` already has `suppressHydrationWarning` on `<html>` so no change needed there.

**Step 1: Fix `theme-provider.tsx`** — remove the mounted guard entirely:

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

**Step 2: Fix `providers.tsx`** — remove the mounted guard that skips ThemeProvider:

```tsx
"use client"

import { ThemeProvider } from "./theme-provider"
import { RestaurantsProvider } from "@/src/hooks/use-restaurants"
import { ErrorBoundary } from "@/src/components/error-boundary"
import { I18nProvider } from "@/src/context/i18n"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <RestaurantsProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </RestaurantsProvider>
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
```

**Step 3: Verify in browser** — toggle dark/light mode, reload page. There should be no flash of wrong theme.

**Step 4: Commit**
```bash
git add src/components/providers.tsx src/components/theme-provider.tsx
git commit -m "fix: remove mounted guard causing dark mode flash on initial render"
```

---

## Task 2: Update Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

**Goal:** Rename model `Restaurant` → `Business`, rename enum value `RESTAURANT_OWNER` → `BUSINESS_OWNER`, add `KnowledgeDoc` + `KnowledgeChunk` models, update all relation names.

**Step 1: Replace the entire content of `prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// B2B2C User Management
model User {
  id                String     @id @default(cuid())
  email             String     @unique
  name              String?
  role              UserRole   @default(BUSINESS_OWNER)
  plan              Plan       @default(STANDARD)
  passwordHash      String

  // Relations
  ownedBusinesses   Business[] @relation("BusinessOwner")
  createdBusinesses Business[] @relation("BusinessCreator")

  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  @@index([email])
}

enum Plan {
  STANDARD
  PREMIUM
}

enum UserRole {
  ADMIN          // Mafalia employees - full access
  BUSINESS_OWNER // Business clients - read-only dashboard
}

enum BusinessType {
  RESTAURANT
  RETAIL
  SERVICE
}

model users_sync {
  id         String    @id
  name       String?
  email      String?
  created_at DateTime
  updated_at DateTime
  deleted_at DateTime?
  raw_json   Json
}

model Business {
  id                    String         @id @default(cuid())
  name                  String
  description           String
  cuisine               String
  whatsappNumber        String
  whatsappPhoneNumberId String         @default("")
  whatsappAccessToken   String?        @default("")
  whatsappAppSecret     String?        @default("")
  webhookVerifyToken    String         @default("")
  supportedLanguages    Json
  isActive              Boolean        @default(true)
  isConcierge           Boolean        @default(false)
  businessType          BusinessType   @default(RESTAURANT)
  userId                String
  welcomeMessage        String         @default("")
  businessHours         String         @default("")
  specialInstructions   String         @default("")
  orderingEnabled       Boolean        @default(true)
  deliveryInfo          String         @default("")
  ownerAgeRange         String?
  ownerSex              String?
  country               String?
  activitySector        String?
  verificationCode      String?
  isVerified            Boolean        @default(false)

  // LAM Integration
  lamApiKey             String?
  lamBaseUrl            String?        @default("https://waba.lafricamobile.com")

  // B2B2C Fields
  ownerId               String?
  owner                 User?          @relation("BusinessOwner", fields: [ownerId], references: [id])
  createdById           String?
  createdBy             User?          @relation("BusinessCreator", fields: [createdById], references: [id])

  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
  apiKeyCreatedAt       DateTime?
  apiKeyHash            String?
  apiKeyRevokedAt       DateTime?

  conversations         Conversation[]
  menuItems             MenuItem[]
  messageLogs           MessageLog[]
  orders                Order[]
  knowledgeDocs         KnowledgeDoc[]

  @@index([userId])
  @@index([ownerId])
  @@index([createdById])
}

model MenuItem {
  id          String   @id @default(cuid())
  businessId  String
  name        String
  description String
  price       Int
  category    String?
  isAvailable Boolean  @default(true)
  imageUrl    String?
  embedding   Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now()) @updatedAt
  business    Business @relation(fields: [businessId], references: [id])
}

model Conversation {
  id          String   @id @default(cuid())
  businessId  String
  phoneNumber String
  messages    Json
  metadata    Json?
  lastActive  DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  business    Business @relation(fields: [businessId], references: [id])

  @@index([businessId, phoneNumber])
}

model Order {
  id           String      @id @default(cuid())
  businessId   String
  customerName String
  phoneNumber  String
  items        Json
  total        Int
  notes        String?
  status       OrderStatus @default(pending)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  business     Business    @relation(fields: [businessId], references: [id])

  @@index([businessId, createdAt])
}

model MessageLog {
  id                String           @id @default(cuid())
  businessId        String
  phoneNumber       String
  whatsappMessageId String
  direction         MessageDirection
  messageType       String?
  templateName      String?
  status            String
  errorCode         String?
  errorTitle        String?
  errorDetail       String?
  raw               Json?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  business          Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId, createdAt])
  @@index([whatsappMessageId])
}

model KnowledgeDoc {
  id          String           @id @default(cuid())
  businessId  String
  business    Business         @relation(fields: [businessId], references: [id], onDelete: Cascade)
  filename    String
  mimeType    String
  contentText String
  chunks      KnowledgeChunk[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@index([businessId])
}

model KnowledgeChunk {
  id         String       @id @default(cuid())
  docId      String
  doc        KnowledgeDoc @relation(fields: [docId], references: [id], onDelete: Cascade)
  businessId String
  content    String
  embedding  Json?
  chunkIndex Int
  createdAt  DateTime     @default(now())

  @@index([businessId])
}

enum OrderStatus {
  pending
  confirmed
  preparing
  delivered
  cancelled
}

enum MessageDirection {
  inbound
  outbound
}

model SystemLog {
  id        String   @id @default(cuid())
  level     String
  message   String
  metadata  Json?
  source    String
  timestamp DateTime @default(now())

  @@index([level])
  @@index([source])
  @@index([timestamp])
}
```

**Step 2: Commit schema before migrating**
```bash
git add prisma/schema.prisma
git commit -m "chore: rename Restaurant→Business in Prisma schema, add KnowledgeDoc/KnowledgeChunk"
```

---

## Task 3: Generate and Run Migration

**Step 1: Run migration (dev environment)**
```bash
npx prisma migrate dev --name rename-restaurant-to-business-add-knowledge
```

Expected: Prisma generates SQL including:
- `ALTER TABLE "Restaurant" RENAME TO "Business";`
- Column rename `restaurantId` → `businessId` on related tables
- `ALTER TYPE "UserRole" RENAME VALUE 'RESTAURANT_OWNER' TO 'BUSINESS_OWNER';`
- `CREATE TABLE "KnowledgeDoc" (...);`
- `CREATE TABLE "KnowledgeChunk" (...);`

If Prisma cannot automatically figure out the rename (it may ask "did you rename Restaurant to Business?"), answer `y`.

**Step 2: Regenerate Prisma client**
```bash
npx prisma generate
```

Expected: Client generated with `prisma.business`, `prisma.knowledgeDoc`, `prisma.knowledgeChunk`.

**Step 3: Verify**
```bash
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); console.log(typeof p.business, typeof p.knowledgeDoc, typeof p.knowledgeChunk);"
```
Expected output: `function function function`

**Step 4: Commit**
```bash
git add prisma/migrations/
git commit -m "chore: add migration for restaurant→business rename and knowledge base tables"
```

---

## Task 4: Update TypeScript Types in `src/lib/data.ts`

**Files:**
- Modify: `src/lib/data.ts`

**Step 1: Rename `Restaurant` interface to `Business`**

Replace the entire `data.ts`:

```typescript
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category?: string
  isAvailable?: boolean
  imageUrl?: string
}

export interface OrderItem {
  itemName: string
  quantity: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  imageUrl?: string
}

export interface ChatbotContext {
  welcomeMessage: string
  businessHours: string
  specialInstructions: string
  orderingEnabled: boolean
  deliveryInfo: string
}

export interface ApiCredentials {
  whatsappAccessToken?: string
  whatsappPhoneNumberId: string
  webhookVerifyToken?: string
  whatsappAppSecret?: string
  lamApiKey?: string
  lamBaseUrl?: string
}

export interface Business {
  id: string
  name: string
  description: string
  cuisine: string
  whatsappNumber: string
  supportedLanguages: string[]
  isActive: boolean
  businessType?: "RESTAURANT" | "RETAIL" | "SERVICE"
  isConcierge: boolean
  menu: MenuItem[]
  chatbotContext: ChatbotContext
  apiCredentials: ApiCredentials
  createdAt: Date
  updatedAt: Date
}

// Legacy alias — remove after all imports updated
export type Restaurant = Business
```

**Step 2: Commit**
```bash
git add src/lib/data.ts
git commit -m "refactor: rename Restaurant interface to Business in data.ts"
```

---

## Task 5: Rename `restaurant-service.ts` → `business-service.ts`

**Files:**
- Delete: `src/lib/restaurant-service.ts`
- Create: `src/lib/business-service.ts`

**Step 1: Copy file and update all internals**

In `src/lib/business-service.ts`, replace the entire content — change:
- Class name: `RestaurantService` → `BusinessService`
- Method names: `getRestaurantById` → `getBusinessById`, `getRestaurantByPhoneNumber` → `getBusinessByPhoneNumber`, etc.
- All `prisma.restaurant.*` → `prisma.business.*`
- All `restaurantId` parameter names → `businessId`
- All `Restaurant` type references → `Business`
- Welcome message default: `"Welcome to our restaurant!"` → `"Welcome to our business!"`
- Internal variable names: `mapPrismaToRestaurant` → `mapPrismaToBusinesss`
- Update import: `import type { Business } from "@/lib/data"` (was `Restaurant`)

Key method signatures to update:
```typescript
static async getBusinessById(id: string): Promise<Business | null>
static async getBusinessByPhoneNumber(phoneNumberId: string): Promise<Business | null>
static async listBusinesses(userId?: string): Promise<Business[]>
static async createBusiness(data: CreateBusinessInput): Promise<Business>
static async updateBusiness(id: string, data: Partial<CreateBusinessInput>): Promise<Business>
static async deleteBusiness(id: string): Promise<void>
// etc — mirror all existing methods, just renamed
```

**Step 2: Delete old file**
```bash
git rm src/lib/restaurant-service.ts
```

**Step 3: Commit**
```bash
git add src/lib/business-service.ts
git commit -m "refactor: rename RestaurantService → BusinessService, restaurant-service.ts → business-service.ts"
```

---

## Task 6: Global Text Replacement Across All 67 Files

**Step 1: Bulk replace identifiers in TypeScript/TSX files**

Run from project root (bash):
```bash
# restaurantId → businessId (parameter names, Prisma field names)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/restaurantId/businessId/g' {} +

# RestaurantService → BusinessService (class name)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/RestaurantService/BusinessService/g' {} +

# restaurant-service → business-service (import paths)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/restaurant-service/business-service/g' {} +

# prisma.restaurant. → prisma.business. (Prisma client calls)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/prisma\.restaurant\./prisma.business./g' {} +

# import { Restaurant } → import { Business } from data.ts (type imports)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/import type { Restaurant/import type { Business/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/import { Restaurant/import { Business/g' {} +

# : Restaurant → : Business (type annotations)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/: Restaurant\b/: Business/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/<Restaurant>/<Business>/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/<Restaurant\[/<Business[/g' {} +

# RESTAURANT_OWNER → BUSINESS_OWNER (UserRole enum)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/RESTAURANT_OWNER/BUSINESS_OWNER/g' {} +

# ownedRestaurants → ownedBusinesses (Prisma relation names)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/ownedRestaurants/ownedBusinesses/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/createdRestaurants/createdBusinesses/g' {} +

# getRestaurant → getBusiness (function names)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/getRestaurant/getBusiness/g' {} +

# use-restaurants → use-businesses (hook file name references in imports)
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/use-restaurants/use-businesses/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/RestaurantsProvider/BusinessesProvider/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/useRestaurants/useBusinesses/g' {} +
```

**Step 2: Update UI strings (user-visible text)**
```bash
# User-visible labels
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/"Restaurant"/"Business"/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/"Restaurants"/"Businesses"/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s/'Restaurant'/'Business'/g" {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s/'Restaurants'/'Businesses'/g" {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/>Restaurant</>Business</g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/>Restaurants</>Businesses</g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/restaurant\b/business/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/restaurants\b/businesses/g' {} +
```

**IMPORTANT — Step 3: Fix over-replacements** (some replacements will be too broad). After running the above, manually fix:
- The `BusinessType` enum values in the schema are fine (already `RESTAURANT`, `RETAIL`, `SERVICE` — these are domain types, not UI labels)
- Check `src/lib/auth.ts` — ensure `UserRole.BUSINESS_OWNER` references are correct
- Check `src/components/theme-provider.tsx` — should not have been touched
- Check `next.config.js` and `tailwind.config.js` if they exist — probably fine

**Step 4: Update JSON locale files**
```bash
# Update locales
find src/locales -name "*.json" -exec sed -i 's/restaurant/business/g; s/Restaurant/Business/g; s/restaurants/businesses/g; s/Restaurants/Businesses/g' {} +
```

**Step 5: Rename hook file**
```bash
git mv src/hooks/use-restaurants.tsx src/hooks/use-businesses.tsx
```

Then inside `src/hooks/use-businesses.tsx`, update the Provider name, hook name, and internal variable names.

**Step 6: Rename API route folders**
```bash
# Rename /api/restaurants/ → /api/businesses/
git mv src/app/api/restaurants src/app/api/businesses

# Rename /api/admin/restaurants/ → /api/admin/businesses/
git mv src/app/api/admin/restaurants src/app/api/admin/businesses
```

**Step 7: Update components in src/components/restaurant/**
```bash
# The folder can stay or be renamed — rename to be consistent
git mv src/components/restaurant src/components/business
```
Then update all imports referencing `components/restaurant/` → `components/business/`.

**Step 8: Update metadata in `src/app/layout.tsx`**

Change:
```typescript
export const metadata: Metadata = {
  title: "Mafal-IA | WhatsApp Chatbot Platform",
  description: "Create and manage intelligent, multilingual WhatsApp chatbots for your business",
  ...
}
```

**Step 9: Run tests to find remaining issues**
```bash
npm test 2>&1 | head -100
```

Fix any test failures caused by the rename (likely import paths or string literals that weren't caught by sed).

**Step 10: Commit**
```bash
git add -A
git commit -m "refactor: global rename restaurant→business across all 67 files (code, UI, routes)"
```

---

## Task 7: Update Test Files for Renamed Service

**Files:**
- Rename: `src/lib/__tests__/restaurant-service.test.ts` → `src/lib/__tests__/business-service.test.ts`

**Step 1: Rename file**
```bash
git mv src/lib/__tests__/restaurant-service.test.ts src/lib/__tests__/business-service.test.ts
```

**Step 2: Update imports inside the file**
Replace `from "../restaurant-service"` → `from "../business-service"` and `RestaurantService` → `BusinessService`, `restaurantId` → `businessId`.

**Step 3: Run all tests and verify 120 pass**
```bash
npm test
```

Expected: All tests pass. If any test fails, read the error and fix the specific reference.

**Step 4: Commit**
```bash
git add src/lib/__tests__/
git commit -m "test: update test files for restaurant→business rename"
```

---

## Task 8: Add `retrieveKnowledge()` with TDD

**Files:**
- Modify: `src/lib/retrieval.ts`
- Modify: `src/lib/__tests__/retrieval.test.ts`

**Step 1: Read existing `src/lib/__tests__/retrieval.test.ts`** to understand the mock pattern used.

**Step 2: Add failing test** for `retrieveKnowledge` at the bottom of the retrieval test file:

```typescript
describe("retrieveKnowledge", () => {
  it("returns top-k chunks ranked by cosine similarity", async () => {
    const mockChunks = [
      { id: "c1", businessId: "b1", docId: "d1", content: "Our return policy is 30 days.", embedding: [1, 0, 0], chunkIndex: 0, createdAt: new Date() },
      { id: "c2", businessId: "b1", docId: "d1", content: "We ship to all regions.", embedding: [0, 1, 0], chunkIndex: 1, createdAt: new Date() },
      { id: "c3", businessId: "b1", docId: "d1", content: "Contact us at support@example.com", embedding: [0, 0, 1], chunkIndex: 2, createdAt: new Date() },
    ]

    // Mock prisma to return these chunks
    vi.mocked(getPrisma).mockResolvedValue({
      knowledgeChunk: {
        findMany: vi.fn().mockResolvedValue(mockChunks),
      },
    } as any)

    // Mock getEmbedding to return a vector close to chunk c1
    vi.mocked(getEmbedding).mockResolvedValue([1, 0, 0])

    const { retrieveKnowledge } = await import("../retrieval")
    const results = await retrieveKnowledge("b1", "return policy", 2)

    expect(results).toHaveLength(2)
    expect(results[0].content).toBe("Our return policy is 30 days.")
    expect(results[0].score).toBeCloseTo(1, 2)
  })

  it("returns empty array when no chunks exist", async () => {
    vi.mocked(getPrisma).mockResolvedValue({
      knowledgeChunk: { findMany: vi.fn().mockResolvedValue([]) },
    } as any)

    const { retrieveKnowledge } = await import("../retrieval")
    const results = await retrieveKnowledge("b1", "anything", 3)
    expect(results).toEqual([])
  })
})
```

**Step 3: Run test to confirm it fails**
```bash
npm test src/lib/__tests__/retrieval.test.ts 2>&1 | tail -20
```
Expected: FAIL — `retrieveKnowledge is not a function`

**Step 4: Implement `retrieveKnowledge` in `src/lib/retrieval.ts`**

Add after the existing `retrieveMenuItems` function:

```typescript
export type RetrievedChunk = {
  id: string
  content: string
  score: number
  docId: string
  chunkIndex: number
}

export async function retrieveKnowledge(businessId: string, query: string, k = 3): Promise<RetrievedChunk[]> {
  const prisma = await getPrisma()
  const chunks = await prisma.knowledgeChunk.findMany({
    where: { businessId },
    select: { id: true, content: true, embedding: true, docId: true, chunkIndex: true },
    take: 500,
  })

  if (chunks.length === 0) return []

  const qVec = await getEmbedding(query)

  const scored = chunks.map((c: any) => {
    let score = 0
    if (Array.isArray(c.embedding)) {
      score = cosineSim(qVec, c.embedding as number[])
    } else {
      score = lexicalScore(query, c.content)
    }
    return { id: c.id, content: c.content, score, docId: c.docId, chunkIndex: c.chunkIndex }
  })

  scored.sort((a: any, b: any) => b.score - a.score)
  return scored.slice(0, k)
}
```

**Step 5: Run tests to confirm they pass**
```bash
npm test src/lib/__tests__/retrieval.test.ts
```
Expected: All tests PASS.

**Step 6: Commit**
```bash
git add src/lib/retrieval.ts src/lib/__tests__/retrieval.test.ts
git commit -m "feat: add retrieveKnowledge() for per-business RAG knowledge base"
```

---

## Task 9: Knowledge Ingestion API

**Files:**
- Create: `src/app/api/businesses/[id]/knowledge/route.ts`
- Create: `src/app/api/businesses/[id]/knowledge/[docId]/route.ts`
- Create: `src/lib/knowledge-ingestor.ts`

**Step 1: Create `src/lib/knowledge-ingestor.ts`** — text extraction + chunking:

```typescript
import { getEmbedding } from "@/src/lib/embeddings"
import { getPrisma } from "@/src/lib/db"

const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

function chunkText(text: string): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length)
    chunks.push(text.slice(start, end).trim())
    start += CHUNK_SIZE - CHUNK_OVERLAP
  }
  return chunks.filter((c) => c.length > 20)
}

export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    // pdf-parse is a CommonJS module
    const pdfParse = (await import("pdf-parse")).default
    const data = await pdfParse(buffer)
    return data.text
  }
  // TXT, MD, plain text
  return buffer.toString("utf-8")
}

export async function ingestDocument(
  businessId: string,
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<{ docId: string; chunkCount: number }> {
  const prisma = await getPrisma()
  const contentText = await extractText(buffer, mimeType)
  const chunks = chunkText(contentText)

  const doc = await prisma.$transaction(async (tx) => {
    const doc = await tx.knowledgeDoc.create({
      data: { businessId, filename, mimeType, contentText },
    })

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i])
      await tx.knowledgeChunk.create({
        data: {
          docId: doc.id,
          businessId,
          content: chunks[i],
          embedding: embedding as any,
          chunkIndex: i,
        },
      })
    }

    return doc
  })

  return { docId: doc.id, chunkCount: chunks.length }
}
```

**Step 2: Create `src/app/api/businesses/[id]/knowledge/route.ts`:**

```typescript
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { getPrisma } from "@/src/lib/db"
import { ingestDocument } from "@/src/lib/knowledge-ingestor"

export const runtime = "nodejs"

// GET /api/businesses/[id]/knowledge — list all docs for this business
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: businessId } = await params
  const prisma = await getPrisma()

  const docs = await prisma.knowledgeDoc.findMany({
    where: { businessId },
    select: {
      id: true,
      filename: true,
      mimeType: true,
      createdAt: true,
      _count: { select: { chunks: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ docs: docs.map(d => ({
    id: d.id,
    filename: d.filename,
    mimeType: d.mimeType,
    createdAt: d.createdAt,
    chunkCount: d._count.chunks,
  })) })
}

// POST /api/businesses/[id]/knowledge — upload and ingest a document
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: businessId } = await params

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const allowedTypes = ["application/pdf", "text/plain", "text/markdown"]
  const mimeType = file.type || "text/plain"

  if (!allowedTypes.includes(mimeType) && !file.name.endsWith(".md")) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PDF, TXT, or MD." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const { docId, chunkCount } = await ingestDocument(businessId, file.name, mimeType, buffer)

  return NextResponse.json({ ok: true, docId, chunkCount })
}
```

**Step 3: Create `src/app/api/businesses/[id]/knowledge/[docId]/route.ts`:**

```typescript
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

// DELETE /api/businesses/[id]/knowledge/[docId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { docId } = await params
  const prisma = await getPrisma()

  // KnowledgeChunk is cascade-deleted via onDelete: Cascade
  await prisma.knowledgeDoc.delete({ where: { id: docId } })

  return NextResponse.json({ ok: true })
}
```

**Step 4: Run tests**
```bash
npm test
```
Expected: All 120 existing tests pass. (No new tests for the route handlers — they're thin wrappers around `ingestDocument` which is the testable core.)

**Step 5: Commit**
```bash
git add src/lib/knowledge-ingestor.ts src/app/api/businesses/
git commit -m "feat: add knowledge base ingestion API (PDF/TXT/MD → chunks → embeddings)"
```

---

## Task 10: Integrate Knowledge into Chatbot Pipeline

**Files:**
- Modify: `src/lib/webhook-processor.ts`
- Modify: `src/lib/__tests__/webhook-processor.test.ts`

**Step 1: Read `src/lib/webhook-processor.ts`** fully to understand how `AIClient.generateResponse()` is called and what context is passed.

**Step 2: Add failing test** in `webhook-processor.test.ts` asserting that `retrieveKnowledge` is called when processing a message:

```typescript
it("calls retrieveKnowledge when processing inbound message", async () => {
  const { retrieveKnowledge } = await import("../retrieval")
  vi.mocked(retrieveKnowledge).mockResolvedValue([
    { id: "c1", content: "Our hours are 9am-5pm", score: 0.9, docId: "d1", chunkIndex: 0 }
  ])
  // ... set up business mock, call processUnifiedMessage
  // assert retrieveKnowledge was called with correct businessId
  expect(retrieveKnowledge).toHaveBeenCalledWith("test-business-id", expect.any(String), 3)
})
```

**Step 3: Run to confirm it fails**
```bash
npm test src/lib/__tests__/webhook-processor.test.ts 2>&1 | tail -20
```

**Step 4: Update `src/lib/webhook-processor.ts`**

Add import at top:
```typescript
import { retrieveMenuItems, retrieveKnowledge } from "@/src/lib/retrieval"
```

In the message processing function, after the existing RAG menu retrieval call, add knowledge retrieval:

```typescript
// Existing: retrieve menu items
const menuItems = await retrieveMenuItems(businessId, messageText, 5)

// New: retrieve knowledge chunks
const knowledgeChunks = await retrieveKnowledge(businessId, messageText, 3)

// Pass both to AI — update the AIClient.generateResponse() call to include knowledgeContext
const response = await AIClient.generateResponse(business, conversation, messageText, {
  retrievedMenuItems: menuItems,
  knowledgeContext: knowledgeChunks.map(c => c.content).join("\n\n"),
})
```

**Step 5: Update `src/lib/ai-client.ts`** to accept and use `knowledgeContext`:

Read the file first, then find where the system prompt is built and append knowledge context:

```typescript
// In the system prompt construction, after menu items, add:
if (options.knowledgeContext) {
  systemPrompt += `\n\n## Business Knowledge Base\n${options.knowledgeContext}`
}
```

**Step 6: Run all tests**
```bash
npm test
```

Fix any failures. All 120+ tests should pass.

**Step 7: Commit**
```bash
git add src/lib/webhook-processor.ts src/lib/ai-client.ts src/lib/__tests__/webhook-processor.test.ts
git commit -m "feat: integrate knowledge base retrieval into chatbot pipeline"
```

---

## Task 11: Knowledge Dashboard UI Page

**Files:**
- Create: `src/app/dashboard/businesses/[id]/knowledge/page.tsx`

**Step 1: Create the page** — file upload dropzone + document list:

```tsx
"use client"

import { useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, FileText, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface KnowledgeDoc {
  id: string
  filename: string
  mimeType: string
  createdAt: string
  chunkCount: number
}

export default function KnowledgePage() {
  const { id: businessId } = useParams<{ id: string }>()
  const [docs, setDocs] = useState<KnowledgeDoc[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing docs on mount
  useState(() => {
    fetch(`/api/businesses/${businessId}/knowledge`)
      .then(r => r.json())
      .then(data => { setDocs(data.docs || []); setLoading(false) })
      .catch(() => setLoading(false))
  })

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return
    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/api/businesses/${businessId}/knowledge`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Upload failed"); return }
      // Refresh list
      const listRes = await fetch(`/api/businesses/${businessId}/knowledge`)
      const listData = await listRes.json()
      setDocs(listData.docs || [])
    } finally {
      setUploading(false)
    }
  }, [businessId])

  const handleDelete = useCallback(async (docId: string) => {
    await fetch(`/api/businesses/${businessId}/knowledge/${docId}`, { method: "DELETE" })
    setDocs(prev => prev.filter(d => d.id !== docId))
  }, [businessId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Upload documents to power your AI chatbot with business-specific knowledge.
        </p>
      </div>

      {/* Upload dropzone */}
      <Card
        className={`border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleUpload(file)
        }}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium">Drop a file here or</p>
            <label className="cursor-pointer">
              <span className="text-primary hover:underline text-sm"> browse to upload</span>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                className="hidden"
                disabled={uploading}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">PDF, TXT, or Markdown — max 10 MB</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* Document list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uploaded Documents</CardTitle>
          <CardDescription>{docs.length} document{docs.length !== 1 ? "s" : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : docs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No documents yet. Upload one above.</p>
          ) : (
            <ul className="divide-y divide-border">
              {docs.map((doc) => (
                <motion.li
                  key={doc.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground">{doc.chunkCount} chunks · {new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 2: Add navigation link** to the business sidebar/detail page. In `src/app/dashboard/businesses/[id]/page.tsx` (or wherever the business sub-nav is defined), add a link to `/dashboard/businesses/[id]/knowledge`.

**Step 3: Verify in browser** — navigate to `/dashboard/businesses/[id]/knowledge`, upload a `.txt` file, confirm chunks are created.

**Step 4: Commit**
```bash
git add src/app/dashboard/businesses/
git commit -m "feat: add knowledge base dashboard UI (upload, list, delete docs)"
```

---

## Task 12: Consolidate Webhooks into `/api/webhook/whatsapp`

**Files:**
- Delete: `src/app/api/whatsapp/route.ts`
- Delete: `src/app/api/webhooks/lam/[id]/route.ts`
- Create: `src/app/api/webhook/whatsapp/route.ts`

**Step 1: Read** `src/app/api/whatsapp/route.ts` fully — note the HMAC verification logic and Meta payload parsing. All of this must be preserved in the new route.

**Step 2: Create `src/app/api/webhook/whatsapp/route.ts`:**

```typescript
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { processUnifiedMessage } from "@/src/lib/webhook-processor"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

// GET — verification (Meta hub.challenge or LAM challenge)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Meta format
  const hubChallenge = searchParams.get("hub.challenge")
  const hubVerifyToken = searchParams.get("hub.verify_token")
  const hubMode = searchParams.get("hub.mode")

  if (hubMode === "subscribe" && hubChallenge) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN
    if (hubVerifyToken === verifyToken) {
      return new Response(hubChallenge, { status: 200 })
    }
    // Check restaurant-specific tokens
    const prisma = await getPrisma()
    const business = await prisma.business.findFirst({
      where: { webhookVerifyToken: hubVerifyToken ?? "" },
    })
    if (business) return new Response(hubChallenge, { status: 200 })
    return new Response("Forbidden", { status: 403 })
  }

  // LAM format
  const lamChallenge = searchParams.get("challenge")
  if (lamChallenge) return new Response(lamChallenge, { status: 200 })

  return NextResponse.json({ ok: true })
}

// POST — inbound message (Meta or LAM)
export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const body = JSON.parse(rawBody)

  // --- META FORMAT DETECTION ---
  // Meta sends: { object: "whatsapp_business_account", entry: [...] }
  if (body?.object === "whatsapp_business_account" || body?.entry?.[0]?.changes?.[0]?.value?.messages) {
    // HMAC verification
    const appSecret = process.env.WHATSAPP_APP_SECRET
    if (appSecret) {
      const sig = request.headers.get("x-hub-signature-256")
      if (sig) {
        const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")
        if (sig !== expected) {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }
      }
    }

    const prisma = await getPrisma()
    const changes = body?.entry?.[0]?.changes ?? []

    for (const change of changes) {
      const value = change?.value
      const messages = value?.messages ?? []
      const phoneNumberId = value?.metadata?.phone_number_id

      for (const msg of messages) {
        if (msg.type !== "text" && msg.type !== "location") continue

        const phoneNumber = msg.from
        const messageId = msg.id
        let messageText = ""
        let metadata: Record<string, any> = {}

        if (msg.type === "text") {
          messageText = msg.text?.body ?? ""
        } else if (msg.type === "location") {
          const { latitude, longitude, name, address } = msg.location ?? {}
          messageText = `My location: ${name || ""} ${address || ""} (${latitude}, ${longitude})`
          metadata.location = { latitude, longitude, name, address }
        }

        // Find business by phoneNumberId
        const business = await prisma.business.findFirst({
          where: { whatsappPhoneNumberId: phoneNumberId ?? "" },
        })

        if (!business) continue

        // Process async (don't await — return 200 quickly)
        processUnifiedMessage(business.id, phoneNumber, messageId, messageText, metadata).catch(
          (err) => console.error("[Webhook] processUnifiedMessage error:", err)
        )
      }
    }

    return NextResponse.json({ ok: true })
  }

  // --- LAM FORMAT DETECTION ---
  // LAM sends: { from: "...", text: "...", id: "..." } or { message: { from, text, id } }
  const lamMessage = body.message || body
  const phoneNumber = lamMessage.from || body.from
  const messageText = lamMessage.text?.body || lamMessage.text || body.text || ""
  const messageId = lamMessage.id || body.id || `lam_${Date.now()}`
  const contactName = lamMessage.name || body.name || body.contact_name

  if (!phoneNumber) {
    return NextResponse.json({ error: "No sender number" }, { status: 400 })
  }

  // Look up business by whatsappNumber (LAM uses the full number)
  const prisma = await getPrisma()
  const business = await prisma.business.findFirst({
    where: { whatsappNumber: phoneNumber },
  })

  if (!business) {
    // Try matching by LAM API key from header
    const lamApiKey = request.headers.get("lam-api-key") || request.headers.get("x-lam-api-key")
    if (lamApiKey) {
      const byKey = await prisma.business.findFirst({ where: { lamApiKey } })
      if (byKey) {
        processUnifiedMessage(byKey.id, phoneNumber, messageId, messageText, { contactName }).catch(console.error)
        return NextResponse.json({ ok: true })
      }
    }
    console.warn("[Webhook] No business found for LAM sender:", phoneNumber)
    return NextResponse.json({ ok: true }) // Return 200 to prevent retries
  }

  processUnifiedMessage(business.id, phoneNumber, messageId, messageText, { contactName }).catch(console.error)
  return NextResponse.json({ ok: true })
}
```

**Step 3: Delete old routes**
```bash
git rm src/app/api/whatsapp/route.ts
git rm -r src/app/api/webhooks/
```

**Step 4: Run tests**
```bash
npm test
```

Fix any test that mocked `/api/whatsapp` — update mock paths to `/api/webhook/whatsapp`.

**Step 5: Commit**
```bash
git add src/app/api/webhook/
git commit -m "feat: consolidate Meta + LAM webhooks into single /api/webhook/whatsapp endpoint"
```

---

## Task 13: Update `.env.example` and Metadata

**Files:**
- Modify: `.env.example` (create if missing)
- Modify: `src/app/layout.tsx`

**Step 1: Read `.env.example`** (or `.env`) to see current vars.

**Step 2: Ensure `.env.example` contains all required vars:**

```bash
# Database
DATABASE_URL=file:./prisma/dev.db

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENKIT_API_KEY=

# WhatsApp (Meta Cloud API)
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_APP_SECRET=
WHATSAPP_VERIFY_TOKEN=

# L'Africa Mobile (LAM)
LAM_API_KEY=
LAM_API_BASE_URL=https://waba.lafricamobile.com
LAM_WABA_ID=225657934082084

# Admin
ADMIN_API_TOKEN=
```

**Step 3: Update `src/app/layout.tsx` metadata:**

```typescript
export const metadata: Metadata = {
  title: "Mafal-IA | WhatsApp Business Chatbot Platform",
  description: "Create and manage intelligent, multilingual WhatsApp chatbots for your business",
  ...
}
```

**Step 4: Commit**
```bash
git add .env.example src/app/layout.tsx
git commit -m "chore: update .env.example with LAM_WABA_ID, fix metadata title"
```

---

## Task 14: UI Color Audit and Final Polish

**Files:**
- Scan and fix: any file in `src/` using `text-blue-*`, `text-purple-*`, `bg-blue-*`, `bg-purple-*` as brand colors

**Step 1: Find violations**
```bash
grep -r "text-blue-\|text-purple-\|bg-blue-\|bg-purple-" src/app src/components --include="*.tsx" -l
```

**Step 2: For each file found**, read it and replace brand-color violations:
- `text-blue-500` → `text-primary`
- `text-purple-500` → `text-primary`
- `bg-blue-500` → `bg-primary`
- `bg-blue-500/10` → `bg-primary/10`
- Keep utility uses (e.g., badges for status where blue/purple is semantic, not brand)

**Step 3: Verify dark mode** — start dev server, toggle between dark and light, check:
- Sidebar background correct in both modes
- Cards have proper contrast
- Inputs readable in dark mode
- No hardcoded `text-white` or `text-black` that breaks in one mode

**Step 4: Run full test suite one final time**
```bash
npm test
```
Expected: All tests pass.

**Step 5: Final commit**
```bash
git add -A
git commit -m "fix: UI color audit — replace brand color violations with text-primary/bg-primary"
```

---

## Final Verification

```bash
# 1. All tests pass
npm test

# 2. Build succeeds
npm run build

# 3. Lint passes
npm run lint
```

If any of these fail, read the error output carefully and fix before declaring done.
