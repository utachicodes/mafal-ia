import { type NextRequest, NextResponse } from "next/server"
import { AIClient } from "@/src/lib/ai-client"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"
import { RestaurantService } from "@/src/lib/restaurant-service"
import type { ChatMessage, MenuItem } from "@/lib/data"
import { ConversationManager } from "@/src/lib/conversation-manager"
import { OrderService } from "@/src/lib/order-service"

const stripBold = (s: string) => s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1")

function normalizeMenu(r: any): MenuItem[] {
    if (Array.isArray(r.menu) && r.menu.length) return r.menu
    if (Array.isArray(r.menuItems) && r.menuItems.length)
        return r.menuItems.map((m: any, idx: number) => ({
            id: String(m.id ?? idx + 1),
            name: String(m.name ?? "Item"),
            description: String(m.description ?? ""),
            price: Number(m.price ?? 0),
            imageUrl: m.imageUrl || undefined,
            category: m.category ? String(m.category) : undefined,
            isAvailable: m.isAvailable ?? true,
        }))
    return []
}

export async function processUnifiedMessage(
    restaurantId: string,
    phoneNumber: string,
    messageId: string,
    messageText: string,
    metadata: {
        contactName?: string
        isLocation?: boolean
        locationData?: { lat: number; lng: number }
    }
) {
    try {
        const restaurant = await RestaurantService.getRestaurantById(restaurantId)

        if (!restaurant || !restaurant.isActive) {
            console.warn(`Restaurant ${restaurantId} not found or inactive`)
            return
        }

        const apiOptions = {
            accessTokenOverride: restaurant.apiCredentials.whatsappAccessToken || undefined,
            lamApiKey: restaurant.apiCredentials.lamApiKey || undefined,
            lamBaseUrl: restaurant.apiCredentials.lamBaseUrl || undefined,
        }

        const businessPhoneNumberId = restaurant.apiCredentials.whatsappPhoneNumberId

        // Update contact name
        if (metadata.contactName) {
            await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { name: metadata.contactName })
        }

        if (metadata.isLocation && metadata.locationData) {
            const loc = `coords:${metadata.locationData.lat},${metadata.locationData.lng}`
            await ConversationManager.updateMetadata(restaurant.id, phoneNumber, {
                locationText: loc,
            })
            messageText = `My location is ${loc}`
        }

        // Check for Pending Order
        const currentMeta = await ConversationManager.getMetadata(restaurant.id, phoneNumber)
        const normalized = messageText.trim().toLowerCase()

        if (currentMeta.pendingOrder) {
            if (["yes", "y", "confirm", "oui"].includes(normalized)) {
                const order = await OrderService.createOrder({
                    restaurantId: restaurant.id,
                    phoneNumber,
                    total: currentMeta.pendingOrder.total,
                    itemsSummary: currentMeta.pendingOrder.itemsSummary,
                    notFoundItems: currentMeta.pendingOrder.notFoundItems,
                    orderItems: currentMeta.pendingOrder.orderItems,
                } as any)

                await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: undefined })

                await WhatsAppClient.sendMessage(
                    businessPhoneNumberId,
                    phoneNumber,
                    `✅ Order #${order.id.slice(-4)} confirmed! Total: ${order.total} FCFA. We are preparing it now.`,
                    apiOptions
                )
                return
            } else if (["no", "n", "cancel"].includes(normalized)) {
                await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: undefined })
                await WhatsAppClient.sendMessage(
                    businessPhoneNumberId,
                    phoneNumber,
                    `❌ Order cancelled. What else would you like?`,
                    apiOptions
                )
                return
            }
        }

        // Save User Message
        const userMsg: ChatMessage = {
            id: messageId,
            role: "user",
            content: messageText,
            timestamp: new Date()
        }
        await ConversationManager.addMessage(restaurant.id, phoneNumber, userMsg)

        const history = await ConversationManager.getConversation(restaurant.id, phoneNumber)
        const menu = normalizeMenu(restaurant)
        const context = `
Restaurant: ${restaurant.name}
Description: ${restaurant.description}
Cuisine: ${restaurant.cuisine}
Hours: ${restaurant.chatbotContext?.businessHours || "Not specified"}
Delivery: ${restaurant.chatbotContext?.deliveryInfo || "Available"}
Customer Name: ${currentMeta.name || "Guest"}
Customer Location: ${currentMeta.locationText || "Unknown"}
    `.trim()

        const aiRes = await AIClient.generateResponse(history, context, menu, restaurant.name)
        let replyText = stripBold(aiRes.response)

        if (aiRes.orderQuote) {
            await ConversationManager.updateMetadata(restaurant.id, phoneNumber, { pendingOrder: aiRes.orderQuote })
            replyText += `\n\nReply YES to confirm this order (${aiRes.orderQuote.total} FCFA).`
        }

        // Save Assistant Message
        await ConversationManager.addMessage(restaurant.id, phoneNumber, {
            id: `ai_${Date.now()}`,
            role: "assistant",
            content: replyText,
            timestamp: new Date(),
            imageUrl: aiRes.imageUrl || undefined
        })

        // Send Reply Text
        await WhatsAppClient.sendMessage(
            businessPhoneNumberId,
            phoneNumber,
            replyText,
            apiOptions
        )

        // Send Image if provided
        if (aiRes.imageUrl) {
            await WhatsAppClient.sendImage(
                businessPhoneNumberId,
                phoneNumber,
                aiRes.imageUrl,
                undefined,
                apiOptions
            )
        }

    } catch (error) {
        console.error(`[WebhookProcessor] Error for restaurant ${restaurantId}:`, error)
    }
}
