import type { MenuItem, Restaurant, OrderItem } from "./data"

// Validation functions
export function validateMenuItem(item: Partial<MenuItem>): item is MenuItem {
  return !!(item.id && item.name && item.description && typeof item.price === "number" && item.price > 0)
}

export function validateRestaurant(restaurant: Partial<Business>): restaurant is Restaurant {
  return !!(
    restaurant.id &&
    restaurant.name &&
    typeof restaurant.description === "string" &&
    Array.isArray(restaurant.menu) &&
    restaurant.chatbotContext &&
    restaurant.apiCredentials &&
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

// CSV parser (expects header). Supported headers: name, description, price, category, isAvailable
export function processMenuFromCSV(csvString: string): MenuItem[] {
  const lines = csvString
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  if (lines.length === 0) return []
  const header = lines[0].split(/,|;|\t/).map((h) => h.trim().toLowerCase())
  const rows = lines.slice(1)
  const items: MenuItem[] = []
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].split(/,|;|\t/).map((c) => c.trim())
    const get = (key: string) => {
      const idx = header.indexOf(key)
      return idx >= 0 ? cols[idx] ?? "" : ""
    }
    const name = get("name")
    const description = get("description")
    const priceRaw = get("price")
    const price = Number.parseInt(String(priceRaw).replace(/[^0-9]/g, ""), 10) || 0
    const category = get("category") || undefined
    const isAvailableRaw = get("isavailable") || get("available") || ""
    const isAvailable = /^(true|1|yes|y)$/i.test(isAvailableRaw)
    if (!name) continue
    items.push({
      id: `item_${Date.now()}_${i}`,
      name,
      description,
      price,
      category,
      isAvailable: isAvailable || true,
    })
  }
  return items
}

// Simple text parser: one item per line.
// Supported shapes:
// - "Name - description - 3500"
// - "Name, 3500"
// - "Name (Category) - 3500"
export function processMenuFromText(text: string): MenuItem[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  const items: MenuItem[] = []
  lines.forEach((line, idx) => {
    let name = ""
    let description = ""
    let category: string | undefined
    let price = 0

    // Try hyphen-delimited: name - description - price
    if (line.includes(" - ")) {
      const parts = line.split(" - ").map((p) => p.trim())
      if (parts.length >= 2) {
        name = parts[0]
        const last = parts[parts.length - 1]
        const priceMatch = last.match(/[0-9][0-9\s\.]*/)
        if (priceMatch) {
          price = Number.parseInt(priceMatch[0].replace(/[^0-9]/g, ""), 10) || 0
          description = parts.slice(1, parts.length - 1).join(" - ")
        } else {
          description = parts.slice(1).join(" - ")
        }
      }
    }

    // Try comma-delimited fallback: name, price
    if (!name) {
      const parts = line.split(",").map((p) => p.trim())
      if (parts.length >= 1) {
        name = parts[0]
        if (parts.length >= 2) {
          const priceMatch = parts.slice(1).join(",").match(/[0-9][0-9\s\.]*/)
          if (priceMatch) price = Number.parseInt(priceMatch[0].replace(/[^0-9]/g, ""), 10) || 0
        }
      }
    }

    // Extract category if present as "Name (Category)"
    const catMatch = name.match(/^(.*)\(([^)]+)\)\s*$/)
    if (catMatch) {
      name = catMatch[1].trim()
      category = catMatch[2].trim()
    }

    if (name) {
      items.push({
        id: `item_${Date.now()}_${idx}`,
        name,
        description,
        price,
        category,
        isAvailable: true,
      })
    }
  })
  return items
}

// Auto-detect format and parse into MenuItem[]
export function autoDetectMenuFromString(raw: string): MenuItem[] {
  const s = raw.trim()
  if (!s) return []
  // JSON if starts with [ or { and parses
  if (/^[\[{]/.test(s)) {
    return processMenuFromJSON(s)
  }
  // CSV if header includes name/price separated by comma/semicolon/tab
  const firstLine = s.split(/\r?\n/)[0] || ""
  if (/(^|,|;|\t)(name)(,|;|\t)/i.test(firstLine) || /(^|,|;|\t)(price)(,|;|\t)/i.test(firstLine)) {
    return processMenuFromCSV(s)
  }
  // Otherwise treat as plain text lines
  return processMenuFromText(s)
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
