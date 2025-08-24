import type { MenuItem, ChatMessage } from "@/lib/data"

// Pure browser-only AI client to avoid bundling server-only deps in client pages
export class AIClientBrowser {
  static async generateResponse(
    messages: ChatMessage[],
    restaurantContext: string,
    menuItems: MenuItem[],
    restaurantName: string,
  ) {
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

  static async getMenuInformation(query: string, menuItems: MenuItem[]) {
    const match = menuItems.find((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    return match ? { name: match.name, price: match.price, description: match.description } : null
  }

  static async calculateOrder(orderText: string, menuItems: MenuItem[]) {
    const lower = orderText.toLowerCase()
    const total = menuItems.reduce((sum, m) => (lower.includes(m.name.toLowerCase()) ? sum + (m.price || 0) : sum), 0)
    return { total }
  }

  static async processMenu(jsonString: string) {
    const parsed = JSON.parse(jsonString)
    const items: MenuItem[] = Array.isArray(parsed) ? parsed : parsed.items ?? []
    return { items }
  }
}
