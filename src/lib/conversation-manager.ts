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
    businessId: string
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

  private static getConversationKey(businessId: string, phoneNumber: string): string {
    return `${businessId}:${phoneNumber}`
  }

  // Get conversation history
  static async getConversation(businessId: string, phoneNumber: string): Promise<ChatMessage[]> {
    const prisma = await getPrisma()
    const conv = await prisma.conversation.findFirst({
      where: { businessId, phoneNumber },
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
  static async addMessage(businessId: string, phoneNumber: string, message: ChatMessage): Promise<void> {
    const prisma = await getPrisma()

    // Fetch existing
    const existing = await this.getConversation(businessId, phoneNumber)
    const updated = [...existing, message].slice(-this.MAX_MESSAGES_PER_CONVERSATION)

    // Upsert conversation
    const existingConv = await prisma.conversation.findFirst({
      where: { businessId, phoneNumber },
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
          businessId,
          phoneNumber,
          messages: updated as any,
          lastActive: new Date()
        }
      })
    }
  }

  // Get metadata (state)
  static async getMetadata(businessId: string, phoneNumber: string): Promise<ConversationMetadata> {
    const prisma = await getPrisma()
    const conv = await prisma.conversation.findFirst({
      where: { businessId, phoneNumber },
      select: { metadata: true }
    })

    if (!conv || !conv.metadata) return {}
    return conv.metadata as ConversationMetadata
  }

  // Update metadata (state)
  static async updateMetadata(
    businessId: string,
    phoneNumber: string,
    patch: Partial<ConversationMetadata>
  ): Promise<void> {
    const prisma = await getPrisma()
    const current = await this.getMetadata(businessId, phoneNumber)
    const updated = { ...current, ...patch }

    const existingConv = await prisma.conversation.findFirst({
      where: { businessId, phoneNumber },
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
          businessId,
          phoneNumber,
          messages: [],
          metadata: updated as any
        }
      })
    }
  }

  // Clear conversation
  static async clearConversation(businessId: string, phoneNumber: string): Promise<void> {
    const prisma = await getPrisma()
    await prisma.conversation.deleteMany({
      where: { businessId, phoneNumber }
    })
  }
}
