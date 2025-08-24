import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/src/lib/env"
import { AIClient } from "@/src/lib/ai-client"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"
import { RestaurantService } from "@/src/lib/restaurant-service"
import type { ChatMessage } from "@/lib/data"
import { validateEnv } from "@/src/lib/env"
import { WebhookValidator } from "@/src/lib/webhook-validator"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { estimateDelivery, formatEstimate } from "@/src/lib/delivery"
import { OrderService } from "@/src/lib/order-service"

// Validate required environment variables at module load (skip in demo mode)
if (!env.DEMO_MODE) {
  validateEnv()
}

// GET endpoint for WhatsApp webhook verification
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get("hub.mode")
    const token = searchParams.get("hub.verify_token")
    const challenge = searchParams.get("hub.challenge")

    console.log("[WhatsApp Webhook] Verification request:", { mode, token, challenge })

    // Verify the webhook
    if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
      console.log("[WhatsApp Webhook] Verification successful")
      return new NextResponse(challenge, { status: 200 })
    }

    console.log("[WhatsApp Webhook] Verification failed - invalid token")
    return new NextResponse("Forbidden", { status: 403 })
  } catch (error) {
    console.error("[WhatsApp Webhook] Verification error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST endpoint for receiving WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    // Read raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get("x-hub-signature-256") || ""

    // Validate signature if secret provided
    if (env.WHATSAPP_APP_SECRET) {
      const valid = WebhookValidator.validateSignature(rawBody, signature, env.WHATSAPP_APP_SECRET)
      if (!valid) {
        console.warn("[WhatsApp Webhook] Invalid signature")
        return new NextResponse("Forbidden", { status: 403 })
      }
    }

    const body = JSON.parse(rawBody)
    console.log("[WhatsApp Webhook] Received payload:", JSON.stringify(body, null, 2))

    if (!WebhookValidator.validatePayload(body)) {
      console.log("[WhatsApp Webhook] Invalid payload structure")
      return new NextResponse("OK", { status: 200 })
    }

    // Validate webhook payload structure
    if (!body.entry || !Array.isArray(body.entry)) {
      console.log("[WhatsApp Webhook] Invalid payload structure")
      return new NextResponse("OK", { status: 200 }) // Return 200 to avoid retries
    }

    // Process each entry in the webhook payload
    for (const entry of body.entry) {
      if (!entry.changes || !Array.isArray(entry.changes)) {
        continue
      }

      for (const change of entry.changes) {
        if (change.field !== "messages" || !change.value) {
          continue
        }

        const { messages, contacts, metadata } = change.value

        // Process incoming messages
        if (messages && Array.isArray(messages)) {
          for (const message of messages) {
            await processIncomingMessage(message, contacts, metadata)
          }
        }
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[WhatsApp Webhook] Processing error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Process individual incoming messages
async function processIncomingMessage(message: any, contacts: any[], metadata: any) {
  try {
    console.log("[WhatsApp] Processing message:", message)

    // Extract message details
    const phoneNumber = message.from
    const messageId = message.id
    const timestamp = message.timestamp

    // Support text and location messages
    let messageText = ""
    let locationFromMessage: string | null = null
    if (message.type === "text" && message.text?.body) {
      messageText = message.text.body
    } else if (message.type === "location" && message.location) {
      const lat = message.location.latitude
      const lng = message.location.longitude
      const locString = `coords:${lat},${lng}`
      // Defer metadata update until after restaurant is loaded
      locationFromMessage = locString
      messageText = `My location is ${locString}`
    } else {
      console.log("[WhatsApp] Skipping unsupported message type", message.type)
      return
    }
    const businessPhoneNumberId = metadata?.phone_number_id

    if (!businessPhoneNumberId) {
      console.error("[WhatsApp] Missing business phone number ID")
      return
    }

    console.log("[WhatsApp] Processing text message:", {
      from: phoneNumber,
      text: messageText,
      businessPhoneNumberId,
    })

    const restaurant = await RestaurantService.getRestaurantByPhoneNumber(businessPhoneNumberId)

    if (!restaurant) {
      console.error("[WhatsApp] No restaurant found for phone number:", businessPhoneNumberId)
      await WhatsAppClient.sendMessage(
        businessPhoneNumberId,
        phoneNumber,
        "Sorry, this restaurant is not configured properly. Please contact support.",
      )
      return
    }

    // Check if restaurant is active
    if (!restaurant.isActive) {
      console.log("[WhatsApp] Restaurant is inactive:", restaurant.name)
      await WhatsAppClient.sendMessage(
        businessPhoneNumberId,
        phoneNumber,
        "Sorry, our chatbot is currently offline. Please contact us directly for assistance.",
      )
      return
    }

    // Persist contact name if provided in webhook contacts
    const contactName = Array.isArray(contacts) && contacts[0]?.profile?.name ? String(contacts[0].profile.name) : undefined
    if (contactName) {
      ConversationManager.updateMetadata(restaurant.id, phoneNumber, { name: contactName })
    }

    // Try to infer delivery zone/estimate from latest message text
    const existingMeta = ConversationManager.getMetadata(restaurant.id, phoneNumber)
    if (!existingMeta.delivery) {
      const est = estimateDelivery(messageText)
      if (est) {
        ConversationManager.updateMetadata(restaurant.id, phoneNumber, { locationText: est.zone, delivery: est })
      }
    }

    // If user shared GPS location, save a generic estimate now that we have restaurant id
    if (locationFromMessage) {
      ConversationManager.updateMetadata(restaurant.id, phoneNumber, {
        locationText: locationFromMessage,
        delivery: { zone: "Coordinates", fee: 2000, etaMinutes: 50, notes: "Approximate from GPS" },
      })
    }

    // Intercept order confirmation/cancellation if a pending order exists
    const pending = existingMeta.pendingOrder
    const normalized = messageText.trim().toLowerCase()
    const isYes = ["yes", "y", "confirm", "ok", "okay", "oui"].includes(normalized)
    const isNo = ["no", "n", "cancel", "non"].includes(normalized)
    if (pending && (isYes || isNo)) {
      if (isYes) {
        const order = await OrderService.createOrder({
          restaurantId: restaurant.id,
          phoneNumber,
          total: pending.total,
          itemsSummary: pending.itemsSummary,
          notFoundItems: pending.notFoundItems,
          orderItems: pending.orderItems,
        })
        ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: undefined })
        const deliveryLine = existingMeta.delivery ? `\n${formatEstimate(existingMeta.delivery)}` : ""
        await WhatsAppClient.sendMessage(
          businessPhoneNumberId,
          phoneNumber,
          `✅ Order confirmed!\nOrder ID: ${order.id}\nTotal: ${order.total} FCFA\nItems: ${order.itemsSummary}${deliveryLine}`,
        )
      } else {
        ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: undefined })
        await WhatsAppClient.sendMessage(
          businessPhoneNumberId,
          phoneNumber,
          "❌ Order canceled. You can send a new order anytime.",
        )
      }
      return
    }

    // Get conversation history for this phone number
    const conversationHistory = ConversationManager.getConversation(restaurant.id, phoneNumber)

    // Add the new message to history
    const newMessage: ChatMessage = {
      id: messageId,
      role: "user",
      content: messageText,
      timestamp: new Date(Number.parseInt(timestamp) * 1000),
    }

    const messages = [...conversationHistory, newMessage]

    const meta = ConversationManager.getMetadata(restaurant.id, phoneNumber)
    const deliveryLine = meta.delivery ? `Delivery: ${formatEstimate(meta.delivery)}` : "Delivery: unknown"
    const customerLine = `Customer: ${meta.name ?? "unknown"} (${phoneNumber})${meta.locationText ? `, Location: ${meta.locationText}` : ""}`

    const menuStatus = restaurant.menu && restaurant.menu.length > 0 ? "" : "Menu Status: No items configured yet."

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
 ${menuStatus}
    `.trim()

    // Generate AI response using Genkit flows
    const aiResponse = await AIClient.generateResponse(messages, restaurantContext, restaurant.menu, restaurant.name)

    console.log("[WhatsApp] AI response generated:", {
      response: aiResponse.response,
      language: aiResponse.detectedLanguage,
      tools: aiResponse.usedTools,
    })

    // If an order quote is present, store it as pending and append confirmation prompt
    let outbound = aiResponse.response
    if (aiResponse.orderQuote && aiResponse.orderQuote.orderItems?.length) {
      ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: aiResponse.orderQuote })
      outbound = `${outbound}\n\nReply YES to confirm this order or NO to cancel.`
    }

    // Send response back to WhatsApp
    await WhatsAppClient.sendMessage(businessPhoneNumberId, phoneNumber, outbound)

    // Save conversation history
    ConversationManager.addMessage(restaurant.id, phoneNumber, {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: outbound,
      timestamp: new Date(),
    })

    console.log("[WhatsApp] Message processed successfully")
  } catch (error) {
    console.error("[WhatsApp] Error processing message:", error)

    // Send error message to user
    try {
      const businessPhoneNumberId = metadata?.phone_number_id
      if (businessPhoneNumberId && message.from) {
        await WhatsAppClient.sendMessage(
          businessPhoneNumberId,
          message.from,
          "Sorry, I'm experiencing technical difficulties. Please try again later.",
        )
      }
    } catch (sendError) {
      console.error("[WhatsApp] Error sending error message:", sendError)
    }
  }
}

// Removed in favor of ConversationManager
