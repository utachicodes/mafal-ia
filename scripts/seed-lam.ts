
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Creating/Updating LAM Test Restaurant...");

    const phone = "221789127058";

    // Create or Update the restaurant
    const restaurant = await prisma.restaurant.upsert({
        where: { whatsappPhoneNumberId: phone }, // Using phone as unique ID for LAM
        update: {
            isActive: true, // Ensure it's active
        },
        create: {
            name: "LAM Test Restaurant",
            description: "A test restaurant for L'Africa Mobile integration testing.",
            cuisine: "Senegalese",
            whatsappPhoneNumber: `+${phone}`,
            whatsappPhoneNumberId: phone, // Crucial for routing
            isActive: true,
            ownerId: "user_2sKy3L9x0Xvb5N7q1Z8p4R6m3", // Placeholder, or fetch an existing admin
            webhookVerifyToken: "lam_verify_token_123",
            apiCredentials: {
                lamApiKey: "TEST_LAM_API_KEY", // User can replace this in DB studio
                lamBaseUrl: "https://waba.lafricamobile.com",
                lamSenderId: phone
            },
            menu: [
                {
                    id: "1",
                    name: "Thieboudienne",
                    description: "Traditional Senegalese rice and fish",
                    price: 3500,
                    category: "Main",
                    isAvailable: true
                },
                {
                    id: "2",
                    name: "Yassa Poulet",
                    description: "Marinated chicken with onions and lemon",
                    price: 3000,
                    category: "Main",
                    isAvailable: true
                },
                {
                    id: "3",
                    name: "Jus de Bissap",
                    description: "Hibiscus flower juice",
                    price: 1000,
                    category: "Drinks",
                    isAvailable: true
                },
                {
                    id: "4",
                    name: "Burger Maison",
                    description: "Beef burger with fries",
                    price: 4500,
                    category: "Main",
                    isAvailable: true
                }
            ]
        },
    });

    console.log(`✅ Restaurant '${restaurant.name}' is ready.`);
    console.log(`- ID: ${restaurant.id}`);
    console.log(`- Phone ID: ${restaurant.whatsappPhoneNumberId}`);
    console.log(`- API Key: (configured in DB JSON)`);
    console.log(`\nTo test, curl the webhook with a LAM-like payload:`);
    console.log(`
curl -X POST http://localhost:3000/api/whatsapp ^
  -H "Content-Type: application/json" ^
  -d '{ "messages": [{ "from": "221771234567", "id": "msg_123", "text": { "body": "Hello menu" } }], "to": "221789127058" }'
  `);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
