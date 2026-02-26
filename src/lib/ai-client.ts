import type { MenuItem, ChatMessage } from "@/lib/data"

// Client-side wrapper for AI flows
export class AIClient {
  static async generateResponse(
    messages: ChatMessage[],
    restaurantContext: string,
    menuItems: MenuItem[],
    restaurantName: string,
    businessId: string = "",
  ) {
    // Server-side: dynamically import Genkit flow runner
    // Ensure flows are registered and get concrete flow refs
    console.log("[AIClient] Starting generateResponse flow for:", restaurantName)
    const { generateResponseFlow } = await import("@/src/ai")
    const { runFlow } = await import("@genkit-ai/flow")
    console.log("[AIClient] Flow runner imported, executing...")
    try {
      // Add a 15-second timeout to the flow execution
      const flowPromise = runFlow(generateResponseFlow as any, {
        messages,
        restaurantContext,
        menuItems,
        restaurantName,
        businessId,
      })

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000)
      )

      const result = await Promise.race([flowPromise, timeoutPromise])
      console.log("[AIClient] Flow result received")
      return result as any
    } catch (error) {
      console.error("[AIClient] Flow execution error or timeout:", error)

      // Return a polite fallback response instead of throwing
      return {
        response: "Désolé, je rencontre une petite difficulté technique. Peux-tu reformuler ta question ?",
        language: "fr",
        intent: "error"
      }
    }
  }

  static async getMenuInformation(query: string, menuItems: MenuItem[], businessId?: string) {
    // If we have a businessId, try a vector search for better semantic matching
    if (businessId) {
      try {
        const { searchMenuItemsByVector } = await import("@/src/lib/embeddings")
        const results = await searchMenuItemsByVector(businessId, query, 3)
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
