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
  apiKey: string
  context: string
  menuItems: MenuItem[]
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

// Mock data for Senegalese restaurants
export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Chez Fatou",
    description: "Authentic Senegalese cuisine in the heart of Dakar",
    apiKey: "mafal_chez_fatou_2024_abc123",
    context:
      "We are a traditional Senegalese restaurant serving authentic dishes like thieboudienne, yassa, and mafe. We are open from 11 AM to 10 PM daily. We offer both dine-in and takeaway options.",
    menuItems: [
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
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
]
