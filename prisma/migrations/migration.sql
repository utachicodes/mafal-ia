-- CreateTable
CREATE TABLE "users_sync" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "raw_json" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappPhoneNumberId" TEXT NOT NULL DEFAULT '',
    "whatsappAccessToken" TEXT DEFAULT '',
    "whatsappAppSecret" TEXT DEFAULT '',
    "webhookVerifyToken" TEXT NOT NULL DEFAULT '',
    "supportedLanguages" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConcierge" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL DEFAULT '',
    "businessHours" TEXT NOT NULL DEFAULT '',
    "specialInstructions" TEXT NOT NULL DEFAULT '',
    "orderingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "deliveryInfo" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "apiKeyHash" TEXT,
    "apiKeyCreatedAt" DATETIME,
    "apiKeyRevokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "embedding" JSONB,
    CONSTRAINT "MenuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Conversation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" INTEGER NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "whatsappMessageId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "messageType" TEXT,
    "templateName" TEXT,
    "status" TEXT NOT NULL,
    "errorCode" TEXT,
    "errorTitle" TEXT,
    "errorDetail" TEXT,
    "raw" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MessageLog_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Restaurant_userId_idx" ON "Restaurant"("userId");

-- CreateIndex
CREATE INDEX "Conversation_restaurantId_phoneNumber_idx" ON "Conversation"("restaurantId", "phoneNumber");

-- CreateIndex
CREATE INDEX "Order_restaurantId_createdAt_idx" ON "Order"("restaurantId", "createdAt");

-- CreateIndex
CREATE INDEX "MessageLog_restaurantId_createdAt_idx" ON "MessageLog"("restaurantId", "createdAt");

-- CreateIndex
CREATE INDEX "MessageLog_whatsappMessageId_idx" ON "MessageLog"("whatsappMessageId");

