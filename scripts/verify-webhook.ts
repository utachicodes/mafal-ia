import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env vars are loaded
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;

async function verifyWebhook() {
    console.log("🚀 Starting Webhook Verification...");
    console.log(`Target: ${BASE_URL}/api/whatsapp`);

    const payload = {
        object: "whatsapp_business_account",
        entry: [
            {
                id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
                changes: [
                    {
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "1234567890",
                                phone_number_id: "PHONE_NUMBER_ID"
                            },
                            contacts: [
                                {
                                    profile: {
                                        name: "Test User"
                                    },
                                    wa_id: "221770000000"
                                }
                            ],
                            messages: [
                                {
                                    from: "221770000000",
                                    id: `wamid.test_${Date.now()}`,
                                    timestamp: Math.floor(Date.now() / 1000),
                                    text: {
                                        body: "Bonjour, quel est le menu du jour ?"
                                    },
                                    type: "text"
                                }
                            ]
                        },
                        field: "messages"
                    }
                ]
            }
        ]
    };

    console.log("📦 Sending Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(`${BASE_URL}/api/whatsapp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);
        const data = await response.text();
        console.log("📥 Response Body:", data);

        if (response.ok) {
            console.log("\n✅ Webhook Verification PASSED: Server accepted the payload.");
        } else {
            console.error("\n❌ Webhook Verification FAILED: Server rejected the payload.");
            process.exit(1);
        }

    } catch (error) {
        console.error("\n❌ Webhook Verification ERROR:", error);
        console.log("⚠️  Ensure the dev server is running on port " + PORT);
        process.exit(1);
    }
}

verifyWebhook();
