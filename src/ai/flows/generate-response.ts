import { defineFlow, runFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkitx/googleai"
import type { MenuItem, ChatMessage } from "@/lib/data"

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
    inputSchema: {
      type: "object",
      properties: {
        messages: { type: "array" },
        restaurantContext: { type: "string" },
        menuItems: { type: "array" },
        restaurantName: { type: "string" },
      },
      required: ["messages", "restaurantContext", "menuItems", "restaurantName"],
    },
    outputSchema: {
      type: "object",
      properties: {
        response: { type: "string" },
        detectedLanguage: { type: "string" },
        usedTools: { type: "array", items: { type: "string" } },
      },
      required: ["response", "detectedLanguage", "usedTools"],
    },
  },
  async (input: GenerateResponseInput): Promise<GenerateResponseOutput> => {
    const { messages, restaurantContext, menuItems, restaurantName } = input
    const lastMessage = messages[messages.length - 1]?.content || ""
    const usedTools: string[] = []

    // Detect language from the last user message
    const languageDetection = await generate({
      model: googleAI("gemini-1.5-flash"),
      prompt: `Detect the language of this message and respond with just the language code (en, fr, wo, ar, etc.): "${lastMessage}"`,
    })

    const detectedLanguage = languageDetection.text().trim().toLowerCase()

    // Analyze intent to determine if tools are needed
    const intentAnalysis = await generate({
      model: googleAI("gemini-1.5-flash"),
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

    const intent = intentAnalysis.text().trim().toLowerCase()
    let toolResponse = ""

    // Use appropriate tools based on intent
    if (intent === "menu_question") {
      try {
        const menuInfo = await runFlow("getMenuItemInformation", {
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
        const orderCalc = await runFlow("calculateOrderTotal", {
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
    const conversationHistory = messages
      .slice(-5) // Keep last 5 messages for context
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const menuSummary = menuItems
      .slice(0, 10) // Show first 10 items as summary
      .map((item) => `- ${item.name}: ${item.description} (${item.price} FCFA)`)
      .join("\n")

    const fullMenu =
      intent === "full_menu"
        ? menuItems.map((item) => `${item.name} - ${item.description} - ${item.price} FCFA`).join("\n")
        : ""

    const prompt = `
You are a friendly, professional WhatsApp chatbot assistant for {{restaurantName}}, a restaurant. You must:

LANGUAGE: Respond in ${detectedLanguage === "fr" ? "French" : detectedLanguage === "wo" ? "Wolof" : detectedLanguage === "ar" ? "Arabic" : "English"} (detected from user's message).

PERSONA: Be warm, helpful, concise, and knowledgeable about the restaurant.

CONTEXT: {{restaurantContext}}

CONVERSATION HISTORY:
{{conversationHistory}}

MENU SUMMARY (first 10 items):
{{menuSummary}}

${toolResponse ? `TOOL INFORMATION: ${toolResponse}` : ""}

${fullMenu ? `FULL MENU:\n${fullMenu}` : ""}

INSTRUCTIONS:
- If tool information is provided, use it in your response
- For menu questions, be specific about ingredients and prices
- For orders, confirm items and provide totals
- For general questions, use the restaurant context
- Keep responses concise but helpful
- Always be polite and professional

Current user message: "${lastMessage}"

Respond naturally as the restaurant's AI assistant:
    `

    const finalResponse = await generate({
      model: googleAI("gemini-1.5-flash"),
      prompt: prompt
        .replace("{{restaurantName}}", restaurantName)
        .replace("{{restaurantContext}}", restaurantContext)
        .replace("{{conversationHistory}}", conversationHistory)
        .replace("{{menuSummary}}", menuSummary),
    })

    return {
      response: finalResponse.text(),
      detectedLanguage,
      usedTools,
    }
  },
)
