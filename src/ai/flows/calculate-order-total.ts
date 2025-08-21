import { defineFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkit-ai/googleai"
import type { MenuItem, OrderItem } from "@/lib/data"
import { calculateOrderTotal } from "@/src/lib/data-utils"
import { z } from "zod"

interface OrderCalculationInput {
  orderText: string
  menuItems: MenuItem[]
}

interface OrderCalculationOutput {
  total: number
  itemsSummary: string
  notFoundItems: string
  orderItems: OrderItem[]
}

// Tool to calculate order totals
export const calculateOrderTotalFlow = defineFlow(
  {
    name: "calculateOrderTotal",
    inputSchema: z.object({
      orderText: z.string(),
      menuItems: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.number(),
          category: z.string().optional(),
          isAvailable: z.boolean().optional(),
        }),
      ),
    }),
    outputSchema: z.object({
      total: z.number(),
      itemsSummary: z.string(),
      notFoundItems: z.string(),
      orderItems: z.array(
        z.object({
          itemName: z.string(),
          quantity: z.number(),
        }),
      ),
    }),
  },
  async (input: any): Promise<OrderCalculationOutput> => {
    const { orderText, menuItems } = input
    const menuItemsTyped = menuItems as MenuItem[]
    const genAny: any = generate as any
    const modelAny: any = (googleAI as any)("gemini-1.5-flash")
    const getText = (res: any): string => {
      try {
        if (!res) return ""
        if (typeof res.text === "function") return String(res.text()).trim()
        if (typeof res.text === "string") return res.text.trim()
        if (typeof res.output === "string") return res.output.trim()
        return String(res).trim()
      } catch {
        return ""
      }
    }

    // Extract order items using AI
    const extractionPrompt = `
Extract the order items and quantities from this customer message: "${orderText}"

Available menu items:
${menuItemsTyped.map((item: MenuItem) => `- ${item.name}`).join("\n")}

Return a JSON array of objects with "itemName" and "quantity" fields.
Match item names as closely as possible to the available menu items.
If no clear order is found, return an empty array.

Example format: [{"itemName": "Thieboudienne", "quantity": 2}]

Return only the JSON array, no other text.
    `

    const extractionResult = await genAny({ model: modelAny, prompt: extractionPrompt })

    let orderItems: OrderItem[] = []

    try {
      const extracted = JSON.parse(getText(extractionResult))
      if (Array.isArray(extracted)) {
        orderItems = extracted.filter((item) => item.itemName && typeof item.quantity === "number" && item.quantity > 0)
      }
    } catch (error) {
      console.error("Error parsing order extraction:", error)
      return {
        total: 0,
        itemsSummary: "Could not parse order from message",
        notFoundItems: "",
        orderItems: [],
      }
    }

    if (orderItems.length === 0) {
      return {
        total: 0,
        itemsSummary: "No valid order items found in message",
        notFoundItems: "",
        orderItems: [],
      }
    }

    // Calculate the order total using existing utility
    const calculation = calculateOrderTotal(orderItems, menuItemsTyped)

    const itemsSummary = calculation.foundItems
      .map((fi: { item: MenuItem; quantity: number; subtotal: number }) => `${fi.quantity}x ${fi.item.name} (${fi.subtotal} FCFA)`)
      .join(", ")

    const notFoundItems = calculation.notFoundItems.length > 0 ? calculation.notFoundItems.join(", ") : ""

    return {
      total: calculation.total,
      itemsSummary,
      notFoundItems,
      orderItems,
    }
  },
)
