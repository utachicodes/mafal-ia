import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/src/lib/env"
import { AIClient } from "@/src/lib/ai-client"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"
import { RestaurantService } from "@/src/lib/restaurant-service"
import type { ChatMessage } from "@/lib/data"
import { validateEnv } from "@/src/lib/env"
import { WebhookValidator } from "@/src/lib/webhook-validator"
import { ConversationManager } from "@/src/lib/conversation-manager"

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
    // In demo mode, accept the webhook and simulate success without hitting external services
    if (env.DEMO_MODE) {
      const rawBody = await request.text().catch(() => "")
      console.log("[WhatsApp Webhook][DEMO] Received payload (not processed):", rawBody?.slice(0, 500))
      return new NextResponse("OK (demo)", { status: 200 })
    }

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

    // Only process text messages for now
    if (message.type !== "text" || !message.text?.body) {
      console.log("[WhatsApp] Skipping non-text message")
      return
    }

    const messageText = message.text.body
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

    const restaurantContext = `
Restaurant: ${restaurant.name}
Description: ${restaurant.description}
Cuisine: ${restaurant.cuisine}
Business Hours: ${restaurant.chatbotContext.businessHours}
Welcome Message: ${restaurant.chatbotContext.welcomeMessage}
Special Instructions: ${restaurant.chatbotContext.specialInstructions}
Delivery Info: ${restaurant.chatbotContext.deliveryInfo}
Ordering Enabled: ${restaurant.chatbotContext.orderingEnabled ? "Yes" : "No"}
    `.trim()

    // Generate AI response using Genkit flows
    const aiResponse = await AIClient.generateResponse(messages, restaurantContext, restaurant.menu, restaurant.name)

    console.log("[WhatsApp] AI response generated:", {
      response: aiResponse.response,
      language: aiResponse.detectedLanguage,
      tools: aiResponse.usedTools,
    })

    // Send response back to WhatsApp
    await WhatsAppClient.sendMessage(businessPhoneNumberId, phoneNumber, aiResponse.response)

    // Save conversation history
    ConversationManager.addMessage(restaurant.id, phoneNumber, {
      id: `ai_${Date.now()}`,
      role: "assistant",
      content: aiResponse.response,
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
