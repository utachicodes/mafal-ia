import { defineFlow, runFlow } from "@genkit-ai/flow"
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
  restaurantId: string
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
          imageUrl: z.string().optional(),
          category: z.string().optional(),
          isAvailable: z.boolean().optional(),
        }),
      ),
      restaurantName: z.string(),
      restaurantId: z.string(),
    }),
    outputSchema: z.object({
      response: z.string(),
      detectedLanguage: z.string(),
      usedTools: z.array(z.string()),
      imageUrl: z.string().optional(),
    }),
  },
  async (input: any): Promise<GenerateResponseOutput & { imageUrl?: string }> => {
    console.log("[Flow/generateResponse] Input received:", {
      restaurantName: input.restaurantName,
      messageCount: input.messages?.length,
      menuCount: input.menuItems?.length
    })
    const { messages, restaurantContext, menuItems, restaurantName, restaurantId } = input
    const messagesTyped = messages as ChatMessage[]
    const menuItemsTyped = menuItems as MenuItem[]
    const lastMessage = messagesTyped[messagesTyped.length - 1]?.content || ""
    const usedTools: string[] = []


    // Detect language from the last user message using Groq (Fast model)
    const { llm } = await import("@/src/lib/llm")

    console.log("[Flow/generateResponse] Detecting language for message:", lastMessage)
    const languageDetectionResponse = await llm.generate(
      `Detect the language of this message and respond with just the language code (en, fr, wo, ar, etc.): "${lastMessage}"`,
      { model: "claude-haiku-4-5-20251001" }
    )
    console.log("[Flow/generateResponse] Language detection result:", languageDetectionResponse)

    // Normalize language detection
    const normalizeLang = (s: string): "en" | "fr" | "wo" | "ar" => {
      const x = (s || "").toLowerCase().trim()
      if (x.startsWith("fr") || x.includes("fran") || x.includes("french")) return "fr"
      if (x.startsWith("wo") || x.includes("wolof")) return "wo"
      if (x.startsWith("ar") || x.includes("arab") || x.includes("الع")) return "ar"
      return "en"
    }

    const detectedLanguage = normalizeLang(languageDetectionResponse)

    // Analyze intent using Groq
    console.log("[Flow/generateResponse] Analyzing intent...")
    const intentAnalysisResponse = await llm.generate(
      `
        Analyze this customer message and determine the intent:
        Message: "${lastMessage}"
        
        Respond with one of:
        - "menu_question" if asking about specific menu items, ingredients, or dietary info
        - "order_calculation" if trying to place an order or calculate total
        - "general" for greetings, hours, location, or general restaurant info
        - "full_menu" if asking to see the complete menu
        
        Respond with just the intent category.
      `,
      { model: "claude-haiku-4-5-20251001" }
    )
    console.log("[Flow/generateResponse] Intent analysis result:", intentAnalysisResponse)

    const intent = intentAnalysisResponse.toLowerCase()
    let toolResponse = ""
    let orderQuote: GenerateResponseOutput["orderQuote"] | undefined

    // Use appropriate tools based on intent
    if (intent === "menu_question") {
      try {
        const { retrieveMenuItems } = await import("@/src/lib/retrieval")
        const results = await retrieveMenuItems(restaurantId, lastMessage, 5)
        if (results.length > 0) {
          toolResponse = results
            .map(r => `- ${r.name}: ${r.description} (${r.price} FCFA)${r.category ? ` [${r.category}]` : ""}`)
            .join("\n")
        }
        usedTools.push("retrieveMenuItems")
      } catch (error) {
        console.error("Error using RAG menu retrieval:", error)
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
      .slice(0, 15) // Show first 15 items as summary
      .map((item: MenuItem) => `- ${item.name}: ${item.description} (${item.price} FCFA)${item.imageUrl ? " [PHOTO AVAILABLE]" : ""}`)
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

MENU SUMMARY:
{{menuSummary}}

${toolResponse ? `TOOL INFORMATION: ${toolResponse}` : ""}

${fullMenu ? `FULL MENU:\n${fullMenu}` : ""}

IMAGE GUIDELINES:
- If you recommend a specific dish and it has [PHOTO AVAILABLE], mention that a photo is available.
- If you are describing a single dish that is the main focus of the user's query, you can "attach" it by including the tag "[IMAGE: dish_name]" at the very end of your response.
- Only attach an image if the dish exists in the menu and has an imageUrl.

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

    console.log("[Flow/generateResponse] Generating final response with Claude Sonnet...")
    const finalResponseText = await llm.generate(
      prompt
        .replace("{{restaurantName}}", restaurantName)
        .replace("{{restaurantContext}}", restaurantContext)
        .replace("{{conversationHistory}}", conversationHistory)
        .replace("{{menuSummary}}", menuSummary),
      { model: "claude-sonnet-4-6" }
    )
    console.log("[Flow/generateResponse] Final response generated")

    const responseText = finalResponseText.trim()

    // Extract Image URL if Groq tagged it
    let finalImageUrl: string | undefined
    const imageMatch = responseText.match(/\[IMAGE:\s*(.*?)\]/)
    if (imageMatch) {
      const dishName = imageMatch[1].trim().toLowerCase()
      const dish = menuItemsTyped.find(m => m.name.toLowerCase().includes(dishName) && m.imageUrl)
      if (dish) {
        finalImageUrl = dish.imageUrl || undefined
      }
    }

    return {
      response: responseText.replace(/\[IMAGE:.*?\]/g, "").trim(),
      detectedLanguage,
      usedTools,
      orderQuote,
      imageUrl: finalImageUrl
    }
  },
)
