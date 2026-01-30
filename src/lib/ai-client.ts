import type { MenuItem, ChatMessage } from "@/lib/data"

// Client-side wrapper for AI flows
export class AIClient {
  static async generateResponse(
    messages: ChatMessage[],
    restaurantContext: string,
    menuItems: MenuItem[],
    restaurantName: string,
  ) {
    // If running in the browser, return a lightweight mock to avoid bundling server deps
    if (typeof window !== "undefined") {
      const lastUser = [...messages].reverse().find((m) => m.role === "user")
      const sample = menuItems.slice(0, 3).map((m) => `${m.name} (${m.price} CFA)`).join(", ")
      return {
        response:
          lastUser?.content?.toLowerCase().includes("menu") || lastUser?.content?.toLowerCase().includes("price")
            ? `Welcome to ${restaurantName}! Here are a few items: ${sample}.`
            : `Noo ngi fi pour jàppal! (${restaurantName})\n${restaurantContext?.slice(0, 140)}`,
        detectedLanguage: "auto",
        usedTools: [],
      }
    }

    // Server-side: dynamically import Genkit flow runner
    try {
      // Ensure flows are registered and get concrete flow refs
      const { generateResponseFlow } = await import("@/src/ai")
      const { runFlow } = await import("@genkit-ai/flow")
      const result = await runFlow(generateResponseFlow as any, {
        messages,
        restaurantContext,
        menuItems,
        restaurantName,
      })
      return result as any
    } catch (error) {
      // Fallback: return a lightweight heuristic response so WhatsApp keeps working
      console.warn("[AIClient] Genkit flow unavailable, using fallback response:", error)
      const lastUser = [...messages].reverse().find((m) => m.role === "user")
      const sample = menuItems.slice(0, 3).map((m) => `${m.name} (${m.price} CFA)`).join(", ")
      return {
        response:
          lastUser?.content?.toLowerCase().includes("menu") || lastUser?.content?.toLowerCase().includes("price")
            ? `Welcome to ${restaurantName}! Here are a few items: ${sample}.`
            : `Noo ngi fi pour jàppal! (${restaurantName})\n${restaurantContext?.slice(0, 200)}`,
        detectedLanguage: "auto",
        usedTools: [],
      }
    }
  }

  static async getMenuInformation(query: string, menuItems: MenuItem[], restaurantId?: string) {
    // If we have a restaurantId, try a vector search for better semantic matching
    if (restaurantId && typeof window === "undefined") {
      try {
        const { searchMenuItemsByVector } = await import("@/src/lib/embeddings")
        const results = await searchMenuItemsByVector(restaurantId, query, 3)
        if (results && results.length > 0) {
          // Return the top result or a formatted summary
          const best = results[0]
          return {
            name: best.name,
            price: best.price,
            description: best.description,
            matches: results // keep pure logic
          }
        }
      } catch (err) {
        console.warn("[AIClient] Vector search failed, falling back to local filter", err)
      }
    }

    // Fallback: Client-side or naive filter
    const lower = query.toLowerCase()
    const match = menuItems.find((m) =>
      m.name.toLowerCase().includes(lower) ||
      (m.description && m.description.toLowerCase().includes(lower))
    )
    return match ? { name: match.name, price: match.price, description: match.description } : null
  }

  static async calculateOrder(orderText: string, menuItems: MenuItem[]) {
    if (typeof window !== "undefined") {
      // naive total: sum of any item names found
      const lower = orderText.toLowerCase()
      const total = menuItems.reduce((sum, m) => (lower.includes(m.name.toLowerCase()) ? sum + (m.price || 0) : sum), 0)
      return { total }
    }
    try {
      const { calculateOrderTotalFlow } = await import("@/src/ai")
      const { runFlow } = await import("@genkit-ai/flow")
      const result = await runFlow(calculateOrderTotalFlow as any, { orderText, menuItems })
      return result as any
    } catch (error) {
      console.error("Error calculating order:", error)
      throw new Error("Failed to calculate order")
    }
  }

  static async processMenu(jsonString: string) {
    if (typeof window !== "undefined") {
      try {
        const parsed = JSON.parse(jsonString)
        const items: MenuItem[] = Array.isArray(parsed) ? parsed : parsed.items ?? []
        return { items }
      } catch {
        throw new Error("Invalid JSON menu format")
      }
    }
    try {
      const { processMenuFlow } = await import("@/src/ai")
      const { runFlow } = await import("@genkit-ai/flow")
      const result = await runFlow(processMenuFlow as any, { jsonString })
      return result as any
    } catch (error) {
      console.error("Error processing menu:", error)
      throw new Error("Failed to process menu")
    }
  }
}
