
import { PrismaClient } from '@prisma/client'

async function main() {
    const prisma = new PrismaClient()

    // 1. Get or create a test restaurant with credentials
    let restaurant = await prisma.restaurant.findFirst({
        where: { name: "Webhook Test Restaurant" }
    })

    if (!restaurant) {
        const user = await prisma.user.findFirst()
        if (!user) throw new Error("No user found")

        restaurant = await prisma.restaurant.create({
            data: {
                name: "Webhook Test Restaurant",
                description: "Testing webhooks",
                cuisine: "Test",
                whatsappNumber: "1234567890",
                whatsappPhoneNumberId: "1234567890", // Important for matching
                supportedLanguages: ["en"],
                userId: user.id
            }
        })
        console.log("Created test restaurant:", restaurant.id)
    } else {
        console.log("Using existing test restaurant:", restaurant.id)
    }

    // 2. Simulate Webhook Payload
    const payload = {
        object: "whatsapp_business_account",
        entry: [{
            id: "WH_ACCOUNT_ID",
            changes: [{
                value: {
                    messaging_product: "whatsapp",
                    metadata: {
                        display_phone_number: "1234567890",
                        phone_number_id: restaurant.whatsappPhoneNumberId // MUST MATCH
                    },
                    contacts: [{
                        profile: { name: "Test User" },
                        wa_id: "221770000000" // Sender phone
                    }],
                    messages: [{
                        from: "221770000000",
                        id: "wamid.test." + Date.now(),
                        timestamp: Math.floor(Date.now() / 1000),
                        text: {
                            body: "Do you have any Quantum Durum?"
                        },
                        type: "text"
                    }]
                },
                field: "messages"
            }]
        }]
    }

    console.log("\nSending webhook payload to localhost:3002...")

    try {
        const res = await fetch('http://localhost:3002/api/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        console.log("Response Status:", res.status)
        const text = await res.text()
        console.log("Response Body:", text)

        if (res.ok) {
            console.log("✅ Webhook accepted.")
            // Ideally verify logic here, but logs will show processing
        } else {
            console.error("❌ Webhook rejected.")
        }

    } catch (e) {
        console.error("Webhook POST failed:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
