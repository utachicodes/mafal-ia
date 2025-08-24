-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappPhoneNumberId" TEXT NOT NULL DEFAULT '',
    "supportedLanguages" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConcierge" BOOLEAN NOT NULL DEFAULT false,
    "welcomeMessage" TEXT NOT NULL DEFAULT '',
    "businessHours" TEXT NOT NULL DEFAULT '',
    "specialInstructions" TEXT NOT NULL DEFAULT '',
    "orderingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "deliveryInfo" TEXT NOT NULL DEFAULT '',
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

-- CreateIndex
CREATE INDEX "Conversation_restaurantId_phoneNumber_idx" ON "Conversation"("restaurantId", "phoneNumber");
