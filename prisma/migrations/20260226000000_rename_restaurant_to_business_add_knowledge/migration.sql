-- Rename enum value RESTAURANT_OWNER → BUSINESS_OWNER
ALTER TYPE "UserRole" RENAME VALUE 'RESTAURANT_OWNER' TO 'BUSINESS_OWNER';

-- Update default value on User.role column
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'BUSINESS_OWNER';

-- Rename Restaurant table → Business
ALTER TABLE "Restaurant" RENAME TO "Business";

-- Rename primary key constraint (PostgreSQL keeps old name after table rename)
ALTER TABLE "Business" RENAME CONSTRAINT "Restaurant_pkey" TO "Business_pkey";

-- Rename foreign key column restaurantId → businessId in MenuItem
ALTER TABLE "MenuItem" RENAME COLUMN "restaurantId" TO "businessId";
ALTER TABLE "MenuItem" RENAME CONSTRAINT "MenuItem_restaurantId_fkey" TO "MenuItem_businessId_fkey";

-- Rename foreign key column restaurantId → businessId in Conversation
ALTER TABLE "Conversation" RENAME COLUMN "restaurantId" TO "businessId";
ALTER TABLE "Conversation" RENAME CONSTRAINT "Conversation_restaurantId_fkey" TO "Conversation_businessId_fkey";

-- Update index on Conversation
DROP INDEX IF EXISTS "Conversation_restaurantId_phoneNumber_idx";
CREATE INDEX "Conversation_businessId_phoneNumber_idx" ON "Conversation"("businessId", "phoneNumber");

-- Rename foreign key column restaurantId → businessId in Order
ALTER TABLE "Order" RENAME COLUMN "restaurantId" TO "businessId";
ALTER TABLE "Order" RENAME CONSTRAINT "Order_restaurantId_fkey" TO "Order_businessId_fkey";

-- Update index on Order
DROP INDEX IF EXISTS "Order_restaurantId_createdAt_idx";
CREATE INDEX "Order_businessId_createdAt_idx" ON "Order"("businessId", "createdAt");

-- Rename foreign key column restaurantId → businessId in MessageLog
ALTER TABLE "MessageLog" RENAME COLUMN "restaurantId" TO "businessId";
ALTER TABLE "MessageLog" RENAME CONSTRAINT "MessageLog_restaurantId_fkey" TO "MessageLog_businessId_fkey";

-- Update index on MessageLog
DROP INDEX IF EXISTS "MessageLog_restaurantId_createdAt_idx";
CREATE INDEX "MessageLog_businessId_createdAt_idx" ON "MessageLog"("businessId", "createdAt");

-- Rename indexes on Business table
DROP INDEX IF EXISTS "Restaurant_userId_idx";
CREATE INDEX "Business_userId_idx" ON "Business"("userId");
DROP INDEX IF EXISTS "Restaurant_ownerId_idx";
CREATE INDEX "Business_ownerId_idx" ON "Business"("ownerId");
DROP INDEX IF EXISTS "Restaurant_createdById_idx";
CREATE INDEX "Business_createdById_idx" ON "Business"("createdById");

-- Rename foreign key constraints on Business table
ALTER TABLE "Business" RENAME CONSTRAINT "Restaurant_ownerId_fkey" TO "Business_ownerId_fkey";
ALTER TABLE "Business" RENAME CONSTRAINT "Restaurant_createdById_fkey" TO "Business_createdById_fkey";

-- CreateTable KnowledgeDoc
CREATE TABLE "KnowledgeDoc" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "contentText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable KnowledgeChunk
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" JSONB,
    "chunkIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeDoc_businessId_idx" ON "KnowledgeDoc"("businessId");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_businessId_idx" ON "KnowledgeChunk"("businessId");

-- AddForeignKey
ALTER TABLE "KnowledgeDoc" ADD CONSTRAINT "KnowledgeDoc_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_docId_fkey" FOREIGN KEY ("docId") REFERENCES "KnowledgeDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
