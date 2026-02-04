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
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value || !value.messages) {
      return NextResponse.json({ ok: true })
    }

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

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Meta Webhook error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
