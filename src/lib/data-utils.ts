import type { MenuItem, Restaurant, OrderItem } from "./data"

// Validation functions
export function validateMenuItem(item: Partial<MenuItem>): item is MenuItem {
  return !!(item.id && item.name && item.description && typeof item.price === "number" && item.price > 0)
}

export function validateRestaurant(restaurant: Partial<Restaurant>): restaurant is Restaurant {
  return !!(
    restaurant.id &&
    restaurant.name &&
    restaurant.description &&
    restaurant.apiKey &&
    restaurant.context &&
    Array.isArray(restaurant.menuItems) &&
    restaurant.createdAt &&
    restaurant.updatedAt
  )
}

// Menu processing utilities
export function processMenuFromJSON(jsonString: string): MenuItem[] {
  try {
    const parsed = JSON.parse(jsonString)

    if (!Array.isArray(parsed)) {
      throw new Error("Menu data must be an array")
    }

    const validItems: MenuItem[] = []

    for (const item of parsed) {
      if (validateMenuItem(item)) {
        validItems.push(item)
      } else {
        console.warn("Invalid menu item skipped:", item)
      }
    }

    return validItems
  } catch (error) {
    console.error("Failed to process menu JSON:", error)
    throw new Error("Invalid JSON format")
  }
}

// Order calculation utilities
export function calculateOrderTotal(
  orderItems: OrderItem[],
  menuItems: MenuItem[],
): {
  total: number
  foundItems: Array<{ item: MenuItem; quantity: number; subtotal: number }>
  notFoundItems: string[]
} {
  const foundItems: Array<{ item: MenuItem; quantity: number; subtotal: number }> = []
  const notFoundItems: string[] = []
  let total = 0

  for (const orderItem of orderItems) {
    const menuItem = menuItems.find((item) => item.name.toLowerCase() === orderItem.itemName.toLowerCase())

    if (menuItem) {
      const subtotal = menuItem.price * orderItem.quantity
      foundItems.push({
        item: menuItem,
        quantity: orderItem.quantity,
        subtotal,
      })
      total += subtotal
    } else {
      notFoundItems.push(orderItem.itemName)
    }
  }

  return { total, foundItems, notFoundItems }
}

// Search utilities
export function searchMenuItems(menuItems: MenuItem[], query: string): MenuItem[] {
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) return menuItems

  return menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm),
  )
}

// Data formatting utilities
export function formatPrice(price: number, currency = "FCFA"): string {
  return `${price.toLocaleString()} ${currency}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// API key generation
export function generateApiKey(restaurantName: string): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const cleanName = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "_")
  return `mafal_${cleanName}_${timestamp}_${randomSuffix}`
}

// Menu item utilities
export function createMenuItem(name: string, description: string, price: number, category?: string): MenuItem {
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name: name.trim(),
    description: description.trim(),
    price: Math.max(0, price),
    category: category?.trim(),
    isAvailable: true,
  }
}

// Restaurant utilities
export function createRestaurant(
  name: string,
  description: string,
  context = "",
): Omit<Restaurant, "id" | "apiKey" | "createdAt" | "updatedAt"> {
  return {
    name: name.trim(),
    description: description.trim(),
    context:
      context.trim() ||
      `We are ${name.trim()}, a restaurant serving delicious food. We are open daily and offer both dine-in and takeaway options.`,
    menuItems: [],
  }
}

// Error handling utilities
export class DataValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "DataValidationError"
  }
}

export function handleDataError(error: unknown): string {
  if (error instanceof DataValidationError) {
    return `Validation error${error.field ? ` in ${error.field}` : ""}: ${error.message}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred"
}
