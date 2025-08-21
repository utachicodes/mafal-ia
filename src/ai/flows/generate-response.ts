import { defineFlow, runFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkit-ai/googleai"
import type { MenuItem, ChatMessage } from "@/lib/data"
import { getMenuItemInformationFlow } from "./smart-menu-retrieval"
import { calculateOrderTotalFlow } from "./calculate-order-total"
import { z } from "zod"

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

    const detectedLanguage = getText(languageDetection).toLowerCase()

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
        toolResponse = `Order Total: ${orderCalc.total} FCFA\nItems: ${orderCalc.itemsSummary}\n${orderCalc.notFoundItems ? `Items not found: ${orderCalc.notFoundItems}` : ""}`
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
- If delivery info in context is unknown, politely ask for the customer's location/neighborhood to estimate fee and ETA.
- If customer name is unknown, ask for their name (short and polite). Always keep their phone number as the record key.
- If delivery info is present in context, mention the delivery fee and estimated time in your reply.
- For orders, confirm items, quantities, subtotal, and clearly state delivery fee if known, then the total.
- If the user seems undecided, propose 2-3 popular or complementary items with prices.
- For menu questions, be specific about ingredients and prices.
- Keep responses concise but helpful and professional.

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
    }
  },
)
