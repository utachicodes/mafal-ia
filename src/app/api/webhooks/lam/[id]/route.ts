import { type NextRequest, NextResponse } from "next/server"
import { processUnifiedMessage } from "@/src/lib/webhook-processor"

export const runtime = "nodejs"

// LAM Webhook structure is often a bit different from Meta
// We expect something that identifies the sender and the message content
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const businessId = params.id

    try {
        const body = await request.json()
        console.log(`[LAM Webhook] Received for restaurant ${businessId}:`, JSON.stringify(body))

        // LAM often forwards messages in a format like:
        // { "from": "22177...", "text": "hello", "id": "...", "name": "..." }
        // Or it might be nested under "message"

        const message = body.message || body
        const phoneNumber = message.from || body.from
        const text = message.text?.body || message.text || body.text || ""
        const messageId = message.id || body.id || `lam_${Date.now()}`
        const contactName = message.name || body.name || body.contact_name

        if (!phoneNumber) {
            return NextResponse.json({ error: "No sender number" }, { status: 400 })
        }

        await processUnifiedMessage(businessId, phoneNumber, messageId, text, {
            contactName
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error(`[LAM Webhook] Error for ${businessId}:`, error)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}

// Verification for LAM if they require it (similar to Meta)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const challenge = request.nextUrl.searchParams.get("challenge") || request.nextUrl.searchParams.get("hub.challenge")
    if (challenge) return new Response(challenge)
    return NextResponse.json({ ok: true })
}
