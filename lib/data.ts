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
  supportedLanguages: string[]
  isActive: boolean
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

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Chez Fatou",
    description: "Authentic Senegalese cuisine in the heart of Dakar",
    cuisine: "Senegalese",
    whatsappNumber: "+221771234567",
    supportedLanguages: ["English", "French", "Wolof"],
    isActive: true,
    menu: [
      {
        id: "1",
        name: "Thieboudienne",
        description: "Traditional Senegalese rice and fish dish with vegetables",
        price: 3500,
        category: "Main Course",
        isAvailable: true,
      },
      {
        id: "2",
        name: "Yassa Poulet",
        description: "Grilled chicken with onion sauce and rice",
        price: 2800,
        category: "Main Course",
        isAvailable: true,
      },
      {
        id: "3",
        name: "Mafe",
        description: "Peanut stew with meat and vegetables",
        price: 3000,
        category: "Main Course",
        isAvailable: true,
      },
    ],
    chatbotContext: {
      welcomeMessage: "Bienvenue chez Fatou! Welcome to Chez Fatou! How can I help you today?",
      businessHours: "11:00 AM - 10:00 PM daily",
      specialInstructions: "We specialize in traditional Senegalese cuisine. Please ask about our daily specials!",
      orderingEnabled: true,
      deliveryInfo: "We offer delivery within Dakar. Delivery fee: 1000 CFA",
    },
    apiCredentials: {
      whatsappAccessToken: "",
      whatsappPhoneNumberId: "",
      webhookVerifyToken: "",
    },
    apiKey: "maf_fatou_abcdef123456",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Le Bistro Moderne",
    description: "Modern French-Senegalese fusion restaurant",
    cuisine: "French-Senegalese Fusion",
    whatsappNumber: "+221779876543",
    supportedLanguages: ["English", "French"],
    isActive: false,
    menu: [
      {
        id: "4",
        name: "Thiof Grillé",
        description: "Grilled grouper with local spices and vegetables",
        price: 4500,
        category: "Main Course",
        isAvailable: true,
      },
      {
        id: "5",
        name: "Salade de Quinoa",
        description: "Quinoa salad with local vegetables and baobab dressing",
        price: 2200,
        category: "Salads",
        isAvailable: true,
      },
    ],
    chatbotContext: {
      welcomeMessage: "Welcome to Le Bistro Moderne! Discover our fusion cuisine.",
      businessHours: "6:00 PM - 11:00 PM (Closed Mondays)",
      specialInstructions: "We offer a unique blend of French and Senegalese flavors. Reservations recommended.",
      orderingEnabled: true,
      deliveryInfo: "Delivery available in Almadies and Ngor areas. Minimum order: 5000 CFA",
    },
    apiCredentials: {
      whatsappAccessToken: "",
      whatsappPhoneNumberId: "",
      webhookVerifyToken: "",
    },
    apiKey: "maf_bistro_123456abcdef",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
