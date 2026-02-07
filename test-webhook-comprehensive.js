import fetch from 'node-fetch';

const testWebhook = async () => {
    console.log("🔍 Testing Webhook Endpoint...\n");

    const payload = {
        messages: [{
            from: "221770000000",
            id: `test_${Date.now()}`,
            text: { body: "Bonjour, je voudrais voir le menu s'il vous plaît" }
        }],
        to: "221771234567"
    };

    try {
        console.log("📤 Sending request to http://localhost:3002/api/whatsapp");
        console.log("📦 Payload:", JSON.stringify(payload, null, 2));
        console.log("");

        const response = await fetch("http://localhost:3002/api/whatsapp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log(`✅ Response Status: ${response.status}`);
        console.log("📥 Response Body:", JSON.stringify(data, null, 2));
        console.log("");

        if (response.ok && data.ok) {
            console.log("✓ Webhook is working correctly!");
            console.log("✓ Message was accepted by the endpoint");
            console.log("");
            console.log("⚠️  Note: Check server logs to verify:");
            console.log("   1. Message was processed by webhook-processor");
            console.log("   2. AI generated a response");
            console.log("   3. Response would be sent back (if LAM is configured)");
        } else {
            console.log("✗ Webhook returned an error");
            console.log("  Check if the restaurant exists with phone: 221771234567");
        }
    } catch (error) {
        console.error("✗ Error testing webhook:", error.message);
        console.log("\n⚠️  Make sure the dev server is running on port 3002");
    }
};

testWebhook();
