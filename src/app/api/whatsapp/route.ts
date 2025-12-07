import { type NextRequest, NextResponse } from "next/server"
import { AIClient } from "@/src/lib/ai-client"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"
import { RestaurantService } from "@/src/lib/restaurant-service"
import type { ChatMessage } from "@/lib/data"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { estimateDelivery, formatEstimate } from "@/src/lib/delivery"
import { OrderService } from "@/src/lib/order-service"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs" // Must be Node for network/DB access

// Helper to strip Markdown bold markers while keeping bullets
const stripBold = (s: string) => s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1")

async function sendOutboundMessage(
  businessPhoneNumberId: string,
  to: string,
  text: string,
  tokenOverride?: string,
) {
  return await WhatsAppClient.sendMessage(businessPhoneNumberId, to, text, tokenOverride)
}

function normalizeMenu(r: any) {
  if (Array.isArray(r.menu) && r.menu.length) return r.menu
  if (Array.isArray(r.menuItems) && r.menuItems.length)
    return r.menuItems.map((m: any, idx: number) => ({
      id: String(m.id ?? idx + 1),
      name: String(m.name ?? "Item"),
      description: String(m.description ?? ""),
      price: Number(m.price ?? 0),
      category: m.category ? String(m.category) : undefined,
      isAvailable: m.isAvailable ?? true,
    }))
  return []
}

// GET endpoint for WhatsApp webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  // Check global or restaurant-specific tokens (simplified for MVP: check env or generic)
  // In production, you might query the DB to see if *any* restaurant matches this token.
  // For now, we assume a single Verify Token for the platform or check against the request.

  if (mode === "subscribe" && challenge) {
    if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log("Webhook verified successfully (Global)")
      return new Response(challenge, { status: 200 })
    }

    // Check if it matches any restaurant verify token (optional robustness)
    const prisma = await getPrisma()
    const match = await prisma.restaurant.findFirst({ where: { webhookVerifyToken: token } })
    if (match) {
      console.log(`Webhook verified for restaurant: ${match.name}`)
      return new Response(challenge, { status: 200 })
    }
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

// POST endpoint for receiving WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Immediate 200 OK to Meta to prevent retries (The "Async" pattern)
    // In a serverless env without queues, we must process quickly or risk timeout.
    // For Vercel max duration, we leverage "waitUntil" if available, or just await efficiently.
    // Ideally, push to a queue here. For now, we await but handle errors gracefully.

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value || !value.messages) {
      return NextResponse.json({ ok: true }) // Not a message, ignore
    }

    const message = value.messages[0]
    const businessPhoneNumberId = value.metadata?.phone_number_id

    // Process in "background" (as much as Vercel allows)
    await processIncomingMessage(message, value.contacts, value.metadata)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Webhook processing error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// Process individual incoming messages
async function processIncomingMessage(message: any, contacts: any[], metadata: any) {
  try {
    const phoneNumber = message.from
    const messageId = message.id
    const businessPhoneNumberId = metadata?.phone_number_id

    if (!businessPhoneNumberId) return

    // 1. ROUTING: Find the exact Restaurant
    const restaurant = await RestaurantService.getRestaurantByPhoneNumber(businessPhoneNumberId)

    if (!restaurant) {
      console.warn(`No restaurant found for ID ${businessPhoneNumberId}`)
      return
    }

    if (!restaurant.isActive) {
      // Silent fail or simple "closed" message could go here
      return
    }

    // 2. STATE: Load/Update specific conversation metadata from DB
    // Update contact name
    const contactName = contacts?.[0]?.profile?.name
    if (contactName) {
      await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { name: contactName })
    }

    let messageText = ""
    if (message.type === "text") {
      messageText = message.text?.body || ""
    } else if (message.type === "location") {
      // Handle location
      const loc = `coords:${message.location.latitude},${message.location.longitude}`
      await ConversationManager.updateMetadata(restaurant.id, phoneNumber, {
        locationText: loc,
        delivery: { zone: "GPS Location", fee: 0, etaMinutes: 45, notes: "Exact GPS" } // Mock estimate
      })
      messageText = `My location is ${loc}`
    } else {
      return // Unsupported type
    }

    // Check for Pending Order Confirmation (Stateful!)
    const meta = await ConversationManager.getMetadata(restaurant.id, phoneNumber)
    const normalized = messageText.trim().toLowerCase()

    if (meta.pendingOrder) {
      if (["yes", "y", "confirm", "oui"].includes(normalized)) {
        // Confirm Order
        const order = await OrderService.createOrder({
          restaurantId: restaurant.id,
          phoneNumber,
          total: meta.pendingOrder.total,
          itemsSummary: meta.pendingOrder.itemsSummary,
          notFoundItems: meta.pendingOrder.notFoundItems,
          orderItems: meta.pendingOrder.orderItems,
        } as any)

        await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: undefined })

        await sendOutboundMessage(
          businessPhoneNumberId,
          phoneNumber,
          `✅ Order #${order.id.slice(-4)} confirmed! Total: ${order.total} FCFA. We are preparing it now.`,
          restaurant.apiCredentials.whatsappAccessToken || undefined
        )
        return
      } else if (["no", "n", "cancel"].includes(normalized)) {
        // Cancel Order
        await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: undefined })
        await sendOutboundMessage(
          businessPhoneNumberId,
          phoneNumber,
          `❌ Order cancelled. What else would you like?`,
          restaurant.apiCredentials.whatsappAccessToken || undefined
        )
        return
      }
    }

    // 3. AI: Generate Response using Restaurant Context + Menu
    // We already have the updated history in DB from `processIncomingMessage` wrapper?
    // Wait, we need to add the User message to DB first.

    const userMsg: ChatMessage = {
      id: messageId,
      role: "user",
      content: messageText,
      timestamp: new Date()
    }
    await ConversationManager.addMessage(restaurant.id, phoneNumber, userMsg)

    // Load history
    const history = await ConversationManager.getConversation(restaurant.id, phoneNumber)

    // Build Prompt Context
    const menu = normalizeMenu(restaurant)
    const context = `
Restaurant: ${restaurant.name}
Description: ${restaurant.description}
Cuisine: ${restaurant.cuisine}
Hours: ${restaurant.chatbotContext?.businessHours || "Not specified"}
Delivery: ${restaurant.chatbotContext?.deliveryInfo || "Available"}
Customer Name: ${meta.name || "Guest"}
Customer Location: ${meta.locationText || "Unknown"}
    `.trim()

    // Call AI
    const aiRes = await AIClient.generateResponse(history, context, menu, restaurant.name)

    // 4. ACTION: Handle AI Output (Order proposals, etc.)
    let replyText = stripBold(aiRes.response)

    if (aiRes.orderQuote) {
      // Save pending order state to DB
      await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: aiRes.orderQuote })
      replyText += `\n\nReply YES to confirm this order (${aiRes.orderQuote.total} FCFA).`
    }

    // Save Assistant Message
    await ConversationManager.addMessage(restaurant.id, phoneNumber, {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: replyText,
      timestamp: new Date()
    })

    // Send Reply
    await sendOutboundMessage(
      businessPhoneNumberId,
      phoneNumber,
      replyText,
      restaurant.apiCredentials.whatsappAccessToken || undefined
    )

  } catch (error) {
    console.error("Error in processIncomingMessage:", error)
  }
}


