import type { Restaurant } from "@/lib/data"

// Local storage keys
const STORAGE_KEYS = {
  RESTAURANTS: "mafal_restaurants",
  SETTINGS: "mafal_settings",
} as const

// Storage utilities for persistence (even though we're using in-memory for now)
export class LocalStorage {
  static saveRestaurants(restaurants: Restaurant[]): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants))
      }
    } catch (error) {
      console.error("Failed to save restaurants to localStorage:", error)
    }
  }

  static loadRestaurants(): Restaurant[] | null {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEYS.RESTAURANTS)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Convert date strings back to Date objects
          return parsed.map((restaurant: any) => ({
            ...restaurant,
            createdAt: new Date(restaurant.createdAt),
            updatedAt: new Date(restaurant.updatedAt),
          }))
        }
      }
    } catch (error) {
      console.error("Failed to load restaurants from localStorage:", error)
    }
    return null
  }

  static clearRestaurants(): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.RESTAURANTS)
      }
    } catch (error) {
      console.error("Failed to clear restaurants from localStorage:", error)
    }
  }

  static saveSettings(settings: Record<string, any>): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      }
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error)
    }
  }

  static loadSettings(): Record<string, any> | null {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
        return stored ? JSON.parse(stored) : null
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error)
    }
    return null
  }
}

// Export/Import utilities
export function exportRestaurantData(restaurant: Restaurant): string {
  return JSON.stringify(restaurant, null, 2)
}

export function importRestaurantData(jsonString: string): Restaurant {
  try {
    const parsed = JSON.parse(jsonString)

    // Validate the imported data structure
    if (!parsed.id || !parsed.name || !Array.isArray(parsed.menu) || !parsed.chatbotContext || !parsed.apiCredentials) {
      throw new Error("Invalid restaurant data structure")
    }

    // Convert date strings back to Date objects
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    }
  } catch (error) {
    throw new Error("Failed to import restaurant data: " + (error as Error).message)
  }
}
