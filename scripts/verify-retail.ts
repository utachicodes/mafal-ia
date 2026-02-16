
import fetch from "node-fetch"

const BASE_URL = "http://localhost:3010/api"

async function runTest() {
    console.log("🚀 Starting End-to-End Test: Retail Bot")

    // 1. Create a "Retail" Business
    console.log("\n1. Creating 'Pro Tennis Shop' (Retail)...")
    const createRes = await fetch(`${BASE_URL}/restaurants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Pro Tennis Shop",
            description: "The best tennis equipment store in Dakar.",
            cuisine: "Sports",
            businessType: "RETAIL",
            menu: [
                { name: "Wilson Clash 100", price: 150000, description: "Versatile racket for all levels.", category: "Rackets" },
                { name: "Babolat Pure Drive", price: 140000, description: "Power and spin focused.", category: "Rackets" },
                { name: "Tennis Balls (3-pack)", price: 5000, description: "Official tournament balls.", category: "Accessories" }
            ]
        })
    })

    if (!createRes.ok) {
        console.error("❌ Failed to create business:", await createRes.text())
        return
    }

    const business = await createRes.json()
    console.log("✅ Business Created! ID:", business.id)
    console.log("   Webhook Verify Token:", business.apiCredentials?.webhookVerifyToken || "Not Set")

    // 2. Chat with the Bot (RAG Check)
    console.log("\n2. Testing Chat (RAG Check)...")
    const chatRes = await fetch(`${BASE_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            restaurantId: business.id,
            message: "Do you have any rackets for beginners?"
        })
    })

    if (!chatRes.ok) {
        console.error("❌ Chat failed:", await chatRes.text())
        return
    }

    const { response } = await chatRes.json()
    console.log("🤖 Bot Response:\n", response)

    if (response.toLowerCase().includes("wilson") || response.toLowerCase().includes("babolat")) {
        console.log("✅ SUCCESS: Bot recommended products from the catalog!")
    } else {
        console.warn("⚠️ WARNING: Bot response might not be RAG-based. Check logs.")
    }

    // 3. Webhook Info
    console.log("\n3. Webhook Setup Info for User:")
    console.log(`   URL: ${BASE_URL.replace("/api", "")}/api/webhook/whatsapp`)
    console.log(`   Verify Token: ${business.apiCredentials?.webhookVerifyToken || "mafalia-token"}`) // Default often used if not set
}

runTest().catch(console.error)
