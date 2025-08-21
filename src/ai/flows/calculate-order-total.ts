import { defineFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkitx/googleai"
import type { MenuItem, OrderItem } from "@/lib/data"
import { calculateOrderTotal } from "@/src/lib/data-utils"

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
    inputSchema: {
      type: "object",
      properties: {
        orderText: { type: "string" },
        menuItems: { type: "array" },
      },
      required: ["orderText", "menuItems"],
    },
    outputSchema: {
      type: "object",
      properties: {
        total: { type: "number" },
        itemsSummary: { type: "string" },
        notFoundItems: { type: "string" },
        orderItems: { type: "array" },
      },
      required: ["total", "itemsSummary", "notFoundItems", "orderItems"],
    },
  },
  async (input: OrderCalculationInput): Promise<OrderCalculationOutput> => {
    const { orderText, menuItems } = input

    // Extract order items using AI
    const extractionPrompt = `
Extract the order items and quantities from this customer message: "${orderText}"

Available menu items:
${menuItems.map((item) => `- ${item.name}`).join("\n")}

Return a JSON array of objects with "itemName" and "quantity" fields.
Match item names as closely as possible to the available menu items.
If no clear order is found, return an empty array.

Example format: [{"itemName": "Thieboudienne", "quantity": 2}]

Return only the JSON array, no other text.
    `

    const extractionResult = await generate({
      model: googleAI("gemini-1.5-flash"),
      prompt: extractionPrompt,
    })

    let orderItems: OrderItem[] = []

    try {
      const extracted = JSON.parse(extractionResult.text().trim())
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
    const calculation = calculateOrderTotal(orderItems, menuItems)

    const itemsSummary = calculation.foundItems
      .map((item) => `${item.quantity}x ${item.item.name} (${item.subtotal} FCFA)`)
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
