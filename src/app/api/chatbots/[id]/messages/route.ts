import { NextRequest, NextResponse } from "next/server"
import { AIClient } from "@/src/lib/ai-client"
import { BusinessService } from "@/src/lib/business-service"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { estimateDelivery, formatEstimate } from "@/src/lib/delivery"

export const runtime = "nodejs"

function stripBold(s: string) {
  return s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1")
}

async function processMessage(businessId: string, from: string, text: string) {
  const restaurant = await BusinessService.getBusinessById(businessId)
  if (!restaurant || !restaurant.isActive) return null

  const meta = await ConversationManager.getMetadata(restaurant.id, from)
  const deliveryLine = meta.delivery ? `Delivery: ${formatEstimate(meta.delivery)}` : "Delivery: unknown"
  const customerLine = `Customer: ${meta?.name ?? "unknown"} (${from})${meta?.locationText ? `, Location: ${meta.locationText}` : ""}`

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

  const history = await ConversationManager.getConversation(restaurant.id, from)
  const messages = [
    ...history,
    { id: `u_${Date.now()}`, role: "user" as const, content: text, timestamp: new Date() },
  ]

  const ai = await AIClient.generateResponse(messages, restaurantContext, (restaurant as any).menu || [], restaurant.name, restaurant.id)

  let outbound = stripBold(ai.response)
  if (ai.orderQuote && ai.orderQuote.orderItems?.length) {
    ConversationManager.updateMetadata(restaurant.id, from, { pendingOrder: ai.orderQuote })
    outbound = `${outbound}\n\nReply YES to confirm this order or NO to cancel.`
  }

  ConversationManager.addMessage(restaurant.id, from, {
    id: `ai_${Date.now()}`,
    role: "assistant",
    content: outbound,
    timestamp: new Date(),
  })

  return {
    ok: true,
    response: outbound,
    detectedLanguage: ai.detectedLanguage,
    usedTools: ai.usedTools,
    orderQuote: ai.orderQuote ?? null,
  }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  return NextResponse.json({ ok: true, id, status: "healthy" })
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = await req.json().catch(() => ({}))
    const from: string | undefined = body?.from
    const text: string | undefined = body?.text
    const callbackUrl: string | undefined = body?.callback_url

    if (!from || !text) {
      return NextResponse.json({ ok: false, error: "from and text are required" }, { status: 400 })
    }

    const restaurant = await BusinessService.getBusinessById(id)
    if (!restaurant) {
      return NextResponse.json({ ok: false, error: "restaurant_not_found" }, { status: 404 })
    }
    if (!restaurant.isActive) {
      return NextResponse.json({ ok: false, error: "restaurant_inactive" }, { status: 400 })
    }

    // Async mode: return immediately and POST result to callback_url
    if (callbackUrl) {
      ;(async () => {
        try {
          const result = await processMessage(id, from, text)
          await fetch(callbackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result ?? { ok: false, error: "processing_failed" }),
          })
        } catch (e) {
          console.error("[Chatbot API] callback delivery failed:", e)
        }
      })()

      return NextResponse.json({ ok: true, queued: true })
    }

    // Sync mode: wait and return result directly
    const result = await processMessage(id, from, text)
    if (!result) {
      return NextResponse.json({ ok: false, error: "restaurant_not_found" }, { status: 404 })
    }
    return NextResponse.json(result)

  } catch (e) {
    console.error("[Chatbot API] error:", e)
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 })
  }
}
