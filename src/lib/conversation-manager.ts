import type { ChatMessage } from "@/lib/data"

// Enhanced conversation management (in production, use a database)
export class ConversationManager {
  private static conversations = new Map<string, ChatMessage[]>()
  private static readonly MAX_MESSAGES_PER_CONVERSATION = 50
  private static readonly CONVERSATION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

  // Get conversation key
  private static getConversationKey(restaurantId: string, phoneNumber: string): string {
    return `${restaurantId}:${phoneNumber}`
  }

  // Get conversation history
  static getConversation(restaurantId: string, phoneNumber: string): ChatMessage[] {
    const key = this.getConversationKey(restaurantId, phoneNumber)
    const messages = this.conversations.get(key) || []

    // Filter out old messages
    const cutoffTime = Date.now() - this.CONVERSATION_TIMEOUT
    return messages.filter((msg) => msg.timestamp.getTime() > cutoffTime)
  }

  // Add message to conversation
  static addMessage(restaurantId: string, phoneNumber: string, message: ChatMessage): void {
    const key = this.getConversationKey(restaurantId, phoneNumber)
    const messages = this.getConversation(restaurantId, phoneNumber)

    messages.push(message)

    // Keep only recent messages
    const recentMessages = messages.slice(-this.MAX_MESSAGES_PER_CONVERSATION)
    this.conversations.set(key, recentMessages)
  }

  // Clear conversation
  static clearConversation(restaurantId: string, phoneNumber: string): void {
    const key = this.getConversationKey(restaurantId, phoneNumber)
    this.conversations.delete(key)
  }

  // Get conversation summary for analytics
  static getConversationSummary(
    restaurantId: string,
    phoneNumber: string,
  ): {
    messageCount: number
    lastMessageTime: Date | null
    conversationDuration: number
  } {
    const messages = this.getConversation(restaurantId, phoneNumber)

    if (messages.length === 0) {
      return {
        messageCount: 0,
        lastMessageTime: null,
        conversationDuration: 0,
      }
    }

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const duration = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime()

    return {
      messageCount: messages.length,
      lastMessageTime: lastMessage.timestamp,
      conversationDuration: duration,
    }
  }

  // Clean up old conversations
  static cleanupOldConversations(): void {
    const cutoffTime = Date.now() - this.CONVERSATION_TIMEOUT

    for (const [key, messages] of this.conversations.entries()) {
      const recentMessages = messages.filter((msg) => msg.timestamp.getTime() > cutoffTime)

      if (recentMessages.length === 0) {
        this.conversations.delete(key)
      } else if (recentMessages.length !== messages.length) {
        this.conversations.set(key, recentMessages)
      }
    }
  }
}
