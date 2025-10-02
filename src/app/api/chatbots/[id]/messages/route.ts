import { NextRequest, NextResponse } from "next/server"
import { AIClient } from "@/src/lib/ai-client"
import { RestaurantService } from "@/src/lib/restaurant-service"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { estimateDelivery, formatEstimate } from "@/src/lib/delivery"
import { env } from "@/src/lib/env"
import { LamClient } from "@/src/lib/lam-client"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

function stripBold(s: string) {
  return s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1")
}

async function getAccessTokenForRestaurant(restaurantId: string): Promise<string | undefined> {
  try {
    const prisma = await getPrisma()
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { whatsappAccessToken: true } })
    return r?.whatsappAccessToken || undefined
  } catch {
    return undefined
  }
}

async function sendOutboundMessage(
  businessPhoneNumberId: string | undefined,
  to: string,
  text: string,
  tokenOverride?: string,
) {
  if (
    env.OUTBOUND_PROVIDER === "lam" &&
    env.LAM_API_BASE_URL &&
    env.LAM_API_KEY &&
    env.LAM_SENDER_ID
  ) {
    return await LamClient.sendMessage({ to, text })
  }
  if (!businessPhoneNumberId) {
    return { success: false, status: 400, errorText: "Missing business phone number id", raw: null, messageId: undefined }
  }
  return await WhatsAppClient.sendMessage(businessPhoneNumberId, to, text, tokenOverride)
}

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { id } = ctx.params
    const body = await req.json().catch(() => ({}))
    const from: string | undefined = body?.from
    const text: string | undefined = body?.text

    if (!from || !text) {
      return NextResponse.json({ ok: false, error: "from and text are required" }, { status: 400 })
    }

    const restaurant = await RestaurantService.getRestaurantById(id)
    if (!restaurant) {
      return NextResponse.json({ ok: false, error: "restaurant_not_found" }, { status: 404 })
    }
    if (!restaurant.isActive) {
      return NextResponse.json({ ok: false, error: "restaurant_inactive" }, { status: 400 })
    }

    // Prepare conversation context
    const meta = ConversationManager.getMetadata(restaurant.id, from)
    const deliveryLine = meta.delivery ? `Delivery: ${formatEstimate(meta.delivery)}` : "Delivery: unknown"
    const customerLine = `Customer: ${meta?.name ?? "unknown"} (${from})${meta?.locationText ? `, Location: ${meta.locationText}` : ""}`

    // First-time delivery guess
    if (!meta.delivery) {
      const est = estimateDelivery(text)
      if (est) ConversationManager.updateMetadata(restaurant.id, from, { locationText: est.zone, delivery: est })
    }

    const restaurantContext = `
Restaurant: ${restaurant.name}
Description: ${restaurant.description}
Cuisine: ${restaurant.cuisine}
Business Hours: ${restaurant.chatbotContext.businessHours}
Welcome Message: ${restaurant.chatbotContext.welcomeMessage}
Special Instructions: ${restaurant.chatbotContext.specialInstructions}
Delivery Info: ${restaurant.chatbotContext.deliveryInfo}
${deliveryLine}
${customerLine}
Ordering Enabled: ${restaurant.chatbotContext.orderingEnabled ? "Yes" : "No"}
    `.trim()

    const history = ConversationManager.getConversation(restaurant.id, from)
    const messages = [
      ...history,
      { id: `u_${Date.now()}`, role: "user" as const, content: text, timestamp: new Date() },
    ]

    const ai = await AIClient.generateResponse(messages, restaurantContext, (restaurant as any).menu || [], restaurant.name)

    let outbound = stripBold(ai.response)
    if (ai.orderQuote && ai.orderQuote.orderItems?.length) {
      ConversationManager.updateMetadata(restaurant.id, from, { pendingOrder: ai.orderQuote })
      outbound = `${outbound}\n\nReply YES to confirm this order or NO to cancel.`
    }

    // Send out via provider
    const bpid = restaurant.apiCredentials?.whatsappPhoneNumberId || undefined
    const tokenOverride = await getAccessTokenForRestaurant(restaurant.id)
    await sendOutboundMessage(bpid, from, outbound, tokenOverride)

    // Save conversation
    ConversationManager.addMessage(restaurant.id, from, {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: outbound,
      timestamp: new Date(),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[Chatbot API] error:", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}
