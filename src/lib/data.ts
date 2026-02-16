export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category?: string
  isAvailable?: boolean
  imageUrl?: string
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
  imageUrl?: string
}

export interface ChatbotContext {
  welcomeMessage: string
  businessHours: string
  specialInstructions: string
  orderingEnabled: boolean
  deliveryInfo: string
}

export interface ApiCredentials {
  whatsappAccessToken?: string
  whatsappPhoneNumberId: string
  webhookVerifyToken?: string
  whatsappAppSecret?: string
  lamApiKey?: string
  lamBaseUrl?: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string
  whatsappNumber: string
  supportedLanguages: string[]
  isActive: boolean
  businessType?: "RESTAURANT" | "RETAIL" | "SERVICE"
  isConcierge: boolean
  menu: MenuItem[]
  chatbotContext: ChatbotContext
  apiCredentials: ApiCredentials
  createdAt: Date
  updatedAt: Date
}
