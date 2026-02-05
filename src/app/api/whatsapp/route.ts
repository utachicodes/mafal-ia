import { type NextRequest, NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { processUnifiedMessage } from "@/src/lib/webhook-processor"
import { RestaurantService } from "@/src/lib/restaurant-service"

export const runtime = "nodejs"

// GET endpoint for WhatsApp webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && challenge) {
    if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 })
    }

    const prisma = await getPrisma()
    const match = await prisma.restaurant.findFirst({ where: { webhookVerifyToken: token } })
    if (match) {
      return new Response(challenge, { status: 200 })
    }
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// POST endpoint for receiving WhatsApp messages from Meta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Check for LAM payload (simplified structure)
    if (body.messages && Array.isArray(body.messages)) {
      const message = body.messages[0]
      // LAM usually sends "to" as the business number, or we might need to rely on a specific field
      // For now, we assume the restaurant ID/phone ID is passed in a way we can resolve, 
      // or we use the 'to' field if it matches our restaurant's phone number ID.
      // However, LAM might just forward the message. 
      // Let's assume LAM sends the business number in 'to' or a custom field.
      // If ambiguous, we might need a specific header or query param in the webhook URL for LAM.
      // BUT, existing logic uses `metadata.phone_number_id` from Meta.
      // Let's try to resolve via `to` (the business number) if available.

      const businessPhoneNumber = body.to || message.to
      const restaurant = await RestaurantService.getRestaurantByPhoneNumber(businessPhoneNumber)

      if (restaurant) {
        console.log(`[LAM Webhook] Received message for ${restaurant.name} (${businessPhoneNumber})`)
        const messageText = message.text?.body || message.text || ""
        await processUnifiedMessage(restaurant.id, message.from, message.id, messageText, {
          contactName: "LAM User", // LAM might not provide profile name
          isLocation: false
        })
        return NextResponse.json({ ok: true })
      }

      console.warn(`[LAM Webhook] No restaurant found for business number: ${businessPhoneNumber}`)
      // If we can't find it via 'to', we might fallback or log.
    }

    // specific check for Meta structure
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value || !value.messages) {
      if (!body.messages) return NextResponse.json({ ok: true }) // Not Meta, handled above or invalid
    }

    if (value) {
      const message = value.messages[0]
      const businessPhoneNumberId = value.metadata?.phone_number_id

      const restaurant = await RestaurantService.getRestaurantByPhoneNumber(businessPhoneNumberId)
      if (!restaurant) return NextResponse.json({ ok: true })

      const contactName = value.contacts?.[0]?.profile?.name
      let messageText = ""
      let isLocation = false
      let locationData = undefined

      if (message.type === "text") {
        messageText = message.text?.body || ""
      } else if (message.type === "location") {
        isLocation = true
        locationData = { lat: message.location.latitude, lng: message.location.longitude }
      }

      if (messageText || isLocation) {
        await processUnifiedMessage(restaurant.id, message.from, message.id, messageText, {
          contactName,
          isLocation,
          locationData
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Meta Webhook error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
