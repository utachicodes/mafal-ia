import { getPrisma } from "@/src/lib/db"
import type { ChatMessage } from "@/lib/data"
import type { DeliveryEstimate } from "./delivery"

type PendingOrder = {
  total: number
  itemsSummary: string
  notFoundItems: string
  orderItems: { itemName: string; quantity: number }[]
}

type ConversationMetadata = {
  name?: string
  locationText?: string
  delivery?: DeliveryEstimate
  pendingOrder?: PendingOrder | undefined
  conciergeOptions?: { id: string; name: string; sample: string; price: number }[]
  conciergePendingOrder?: {
    restaurantId: string
    restaurantName: string
    itemsSummary: string
    total: number
    orderItems: { itemName: string; quantity: number }[]
  }
  lastQuery?: string
}

export class ConversationManager {
  private static readonly MAX_MESSAGES_PER_CONVERSATION = 50
  // No memory cache - direct DB access for stateless reliability

  private static getConversationKey(restaurantId: string, phoneNumber: string): string {
    return `${restaurantId}:${phoneNumber}`
  }

  // Get conversation history
  static async getConversation(restaurantId: string, phoneNumber: string): Promise<ChatMessage[]> {
    const prisma = await getPrisma()
    const conv = await prisma.conversation.findFirst({
      where: { restaurantId, phoneNumber },
      select: { messages: true },
    })

    if (!conv || !conv.messages) return []

    // Parse JSON messages
    try {
      const messages = conv.messages as unknown as ChatMessage[]
      // Reconstitute Date objects if they were serialized
      return messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    } catch {
      return []
    }
  }

  // Add message to conversation
  static async addMessage(restaurantId: string, phoneNumber: string, message: ChatMessage): Promise<void> {
    const prisma = await getPrisma()

    // Fetch existing
    const existing = await this.getConversation(restaurantId, phoneNumber)
    const updated = [...existing, message].slice(-this.MAX_MESSAGES_PER_CONVERSATION)

    // Upsert conversation
    const existingConv = await prisma.conversation.findFirst({
      where: { restaurantId, phoneNumber },
      select: { id: true }
    })

    if (existingConv) {
      await prisma.conversation.update({
        where: { id: existingConv.id },
        data: {
          messages: updated as any,
          lastActive: new Date()
        }
      })
    } else {
      await prisma.conversation.create({
        data: {
          restaurantId,
          phoneNumber,
          messages: updated as any,
          lastActive: new Date()
        }
      })
    }
  }

  // Get metadata (state)
  static async getMetadata(restaurantId: string, phoneNumber: string): Promise<ConversationMetadata> {
    const prisma = await getPrisma()
    const conv = await prisma.conversation.findFirst({
      where: { restaurantId, phoneNumber },
      select: { metadata: true }
    })

    if (!conv || !conv.metadata) return {}
    return conv.metadata as ConversationMetadata
  }

  // Update metadata (state)
  static async updateMetadata(
    restaurantId: string,
    phoneNumber: string,
    patch: Partial<ConversationMetadata>
  ): Promise<void> {
    const prisma = await getPrisma()
    const current = await this.getMetadata(restaurantId, phoneNumber)
    const updated = { ...current, ...patch }

    const existingConv = await prisma.conversation.findFirst({
      where: { restaurantId, phoneNumber },
      select: { id: true }
    })

    if (existingConv) {
      await prisma.conversation.update({
        where: { id: existingConv.id },
        data: { metadata: updated as any }
      })
    } else {
      // Create if doesn't exist (rare case if metadata set before message, but possible)
      await prisma.conversation.create({
        data: {
          restaurantId,
          phoneNumber,
          messages: [],
          metadata: updated as any
        }
      })
    }
  }

  // Clear conversation
  static async clearConversation(restaurantId: string, phoneNumber: string): Promise<void> {
    const prisma = await getPrisma()
    await prisma.conversation.deleteMany({
      where: { restaurantId, phoneNumber }
    })
  }
}
