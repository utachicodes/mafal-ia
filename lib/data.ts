
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category?: string
  isAvailable?: boolean
}

export interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string
  whatsappNumber: string
  // Optional connection status used by WhatsApp Quick Connect simulator
  whatsappConnected?: boolean
  supportedLanguages: string[]
  isActive: boolean
  // Marks this WhatsApp number as a global concierge entry point
  isConcierge?: boolean
  menu: MenuItem[]
  chatbotContext: {
    welcomeMessage: string
    businessHours: string
    specialInstructions: string
    orderingEnabled: boolean
    deliveryInfo: string
  }
  apiCredentials: {
    whatsappAccessToken: string
    whatsappPhoneNumberId: string
    webhookVerifyToken: string
  }
  // App-managed fields used in UI and hooks
  apiKey: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  itemName: string
  quantity: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

