import { defineFlow, runFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkit-ai/googleai"
import type { MenuItem, ChatMessage } from "@/lib/data"
import { getMenuItemInformationFlow } from "./smart-menu-retrieval"
import { calculateOrderTotalFlow } from "./calculate-order-total"
import { z } from "zod"
import { estimateDelivery, formatEstimate } from "@/src/lib/delivery"

// Define the input schema for the main conversational flow
interface GenerateResponseInput {
  messages: ChatMessage[]
  restaurantContext: string
  menuItems: MenuItem[]
  restaurantName: string
}

interface GenerateResponseOutput {
  response: string
  detectedLanguage: string
  usedTools: string[]
  orderQuote?: {
    total: number
    itemsSummary: string
    notFoundItems: string
    orderItems: { itemName: string; quantity: number }[]
  }
}

// Main conversational flow - the central AI brain
export const generateResponseFlow = defineFlow(
  {
    name: "generateResponse",
    inputSchema: z.object({
      messages: z.array(
        z.object({
          id: z.string(),
          role: z.enum(["user", "assistant"]),
          content: z.string(),
          // Flow runtime may serialize Dates; accept any to match interface while staying tolerant
          timestamp: z.any(),
        }),
      ),
      restaurantContext: z.string(),
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
      restaurantName: z.string(),
    }),
    outputSchema: z.object({
      response: z.string(),
      detectedLanguage: z.string(),
      usedTools: z.array(z.string()),
    }),
  },
  async (input: any): Promise<GenerateResponseOutput> => {
    const { messages, restaurantContext, menuItems, restaurantName } = input
    const messagesTyped = messages as ChatMessage[]
    const menuItemsTyped = menuItems as MenuItem[]
    const lastMessage = messagesTyped[messagesTyped.length - 1]?.content || ""
    const usedTools: string[] = []

    // Helper to normalize text output across Genkit versions
    const getText = (res: any): string => {
      try {
        if (!res) return ""
        // function style
        if (typeof res.text === "function") return String(res.text()).trim()
        // property style
        if (typeof res.text === "string") return res.text.trim()
        if (typeof res.output === "string") return res.output.trim()
        return String(res).trim()
      } catch {
        return ""
      }
    }

    // Detect language from the last user message
    const genAny: any = generate as any
    const modelAny: any = (googleAI as any)("gemini-1.5-flash")
    const languageDetection = await genAny({
      model: modelAny,
      prompt: `Detect the language of this message and respond with just the language code (en, fr, wo, ar, etc.): "${lastMessage}"`,
    })

    // Normalize language detection to robustly handle variants like "fr-FR", "Français", etc.
    const normalizeLang = (s: string): "en" | "fr" | "wo" | "ar" => {
      const x = (s || "").toLowerCase().trim()
      if (x.startsWith("fr") || x.includes("fran") || x.includes("french")) return "fr"
      if (x.startsWith("wo") || x.includes("wolof")) return "wo"
      if (x.startsWith("ar") || x.includes("arab") || x.includes("الع")) return "ar"
      return "en"
    }

    const detectedLanguage = normalizeLang(getText(languageDetection))

    // Analyze intent to determine if tools are needed
    const intentAnalysis = await genAny({
      model: modelAny,
      prompt: `
        Analyze this customer message and determine the intent:
        Message: "${lastMessage}"
        
        Respond with one of:
        - "menu_question" if asking about specific menu items, ingredients, or dietary info
        - "order_calculation" if trying to place an order or calculate total
        - "general" for greetings, hours, location, or general restaurant info
        - "full_menu" if asking to see the complete menu
        
        Respond with just the intent category.
      `,
    })

    const intent = getText(intentAnalysis).toLowerCase()
    let toolResponse = ""
    let orderQuote: GenerateResponseOutput["orderQuote"] | undefined

    // Use appropriate tools based on intent
    if (intent === "menu_question") {
      try {
        const menuInfo = await runFlow(getMenuItemInformationFlow as any, {
          query: lastMessage,
          menuItems,
        })
        toolResponse = menuInfo.information
        usedTools.push("getMenuItemInformation")
      } catch (error) {
        console.error("Error using menu information tool:", error)
      }
    } else if (intent === "order_calculation") {
      try {
        const orderCalc = await runFlow(calculateOrderTotalFlow as any, {
          orderText: lastMessage,
          menuItems,
        })
        // Try to infer delivery zone from message; if present, include delivery fee in total
        const deliveryEst = estimateDelivery(lastMessage)
        const baseToolLine = `Order Subtotal: ${orderCalc.total} FCFA` 
        const itemsLine = `Items: ${orderCalc.itemsSummary}`
        let deliveryLine = ""
        let finalTotal = orderCalc.total
        if (deliveryEst) {
          deliveryLine = `Delivery: ${formatEstimate(deliveryEst)}`
          finalTotal = orderCalc.total + deliveryEst.fee
          usedTools.push("estimateDelivery")
        }

        toolResponse = [baseToolLine, itemsLine, deliveryLine].filter(Boolean).join("\n")
        orderQuote = {
          total: finalTotal,
          itemsSummary: orderCalc.itemsSummary,
          notFoundItems: orderCalc.notFoundItems,
          orderItems: orderCalc.orderItems,
        }
        usedTools.push("calculateOrderTotal")
      } catch (error) {
        console.error("Error using order calculation tool:", error)
      }
    }

    // Generate the main response using Handlebars-style templating
    const conversationHistory = messagesTyped
      .slice(-5) // Keep last 5 messages for context
      .map((msg: ChatMessage) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const menuSummary = menuItemsTyped
      .slice(0, 10) // Show first 10 items as summary
      .map((item: MenuItem) => `- ${item.name}: ${item.description} (${item.price} FCFA)`)
      .join("\n")

    const fullMenu =
      intent === "full_menu"
        ? menuItemsTyped.map((item: MenuItem) => `${item.name} - ${item.description} - ${item.price} FCFA`).join("\n")
        : ""

    const prompt = `
You are a friendly, professional WhatsApp chatbot assistant for {{restaurantName}}, a restaurant.

LANGUAGE: Respond in ${detectedLanguage === "fr" ? "French" : detectedLanguage === "wo" ? "Wolof" : detectedLanguage === "ar" ? "Arabic" : "English"}.

PERSONA: Warm, helpful, concise, and knowledgeable.

CONTEXT: {{restaurantContext}}

CONVERSATION HISTORY:
{{conversationHistory}}

MENU SUMMARY (first 10 items):
{{menuSummary}}

${toolResponse ? `TOOL INFORMATION: ${toolResponse}` : ""}

${fullMenu ? `FULL MENU:\n${fullMenu}` : ""}

INSTRUCTIONS:
- Start by greeting the customer using the restaurant name. Offer to show the menu.
- When an order is detected, ALWAYS ask: "Dine-in or delivery?" If delivery, ask for their neighborhood/location.
- If location is provided, estimate delivery fee and ETA. If unknown, ask a clarifying follow-up.
- Confirm items and quantities, show subtotal, delivery fee (if any), and the final total.
- Do not require a phone number; proceed with the chat context only.
- For menu questions, be specific about ingredients and prices.
- Keep responses concise, warm, and professional.

Current user message: "${lastMessage}"

Respond naturally as the restaurant's AI assistant:
    `

    const finalResponse = await genAny({
      model: modelAny,
      prompt: prompt
        .replace("{{restaurantName}}", restaurantName)
        .replace("{{restaurantContext}}", restaurantContext)
        .replace("{{conversationHistory}}", conversationHistory)
        .replace("{{menuSummary}}", menuSummary),
    })

    return {
      response: getText(finalResponse),
      detectedLanguage,
      usedTools,
      orderQuote,
    }
  },
)
