-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
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
    "welcomeMessage" TEXT NOT NULL DEFAULT '',
    "businessHours" TEXT NOT NULL DEFAULT '',
    "specialInstructions" TEXT NOT NULL DEFAULT '',
    "orderingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "deliveryInfo" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Restaurant" ("businessHours", "createdAt", "cuisine", "deliveryInfo", "description", "id", "isActive", "isConcierge", "name", "orderingEnabled", "specialInstructions", "supportedLanguages", "updatedAt", "welcomeMessage", "whatsappAccessToken", "whatsappAppSecret", "whatsappNumber", "whatsappPhoneNumberId") SELECT "businessHours", "createdAt", "cuisine", "deliveryInfo", "description", "id", "isActive", "isConcierge", "name", "orderingEnabled", "specialInstructions", "supportedLanguages", "updatedAt", "welcomeMessage", "whatsappAccessToken", "whatsappAppSecret", "whatsappNumber", "whatsappPhoneNumberId" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
