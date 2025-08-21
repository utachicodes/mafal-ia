import { defineFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkit-ai/googleai"
import type { MenuItem } from "@/lib/data"
import { z } from "zod"

interface MenuRetrievalInput {
  query: string
  menuItems: MenuItem[]
}

interface MenuRetrievalOutput {
  information: string
  relevantItems: MenuItem[]
}

// Specialized RAG tool for menu item information
export const getMenuItemInformationFlow = defineFlow(
  {
    name: "getMenuItemInformation",
    inputSchema: z.object({
      query: z.string(),
      menuItems: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional().default(""),
          price: z.number().optional().default(0),
          category: z.string().optional(),
          isAvailable: z.boolean().optional(),
        }),
      ),
    }),
    outputSchema: z.object({
      information: z.string(),
      relevantItems: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional().default(""),
          price: z.number().optional().default(0),
          category: z.string().optional(),
          isAvailable: z.boolean().optional(),
        }),
      ),
    }),
  },
  async (input: MenuRetrievalInput): Promise<MenuRetrievalOutput> => {
    const { query, menuItems } = input
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

    // First, find relevant menu items using semantic search
    const searchPrompt = `
Given this customer query: "${query}"

Find the most relevant menu items from this list:
${menuItems.map((item, index) => `${index + 1}. ${item.name}: ${item.description} - ${item.price} FCFA`).join("\n")}

Return the numbers of the most relevant items (1-3 items max), separated by commas.
If no items are relevant, return "none".
    `

    const searchResult = await genAny({ model: modelAny, prompt: searchPrompt })

    const relevantIndexes = getText(searchResult)
    let relevantItems: MenuItem[] = []

    if (relevantIndexes !== "none") {
      const indexes = relevantIndexes
        .split(",")
        .map((idx) => Number.parseInt(idx.trim()) - 1)
        .filter((idx) => idx >= 0 && idx < menuItems.length)

      relevantItems = indexes.map((idx) => menuItems[idx])
    }

    // Generate detailed information about the relevant items
    if (relevantItems.length === 0) {
      return {
        information:
          "I couldn't find any menu items matching your query. Please ask about specific dishes or browse our full menu.",
        relevantItems: [],
      }
    }

    const informationPrompt = `
Customer query: "${query}"

Relevant menu items:
${relevantItems.map((item) => `- ${item.name}: ${item.description} (${item.price} FCFA)${item.category ? ` [${item.category}]` : ""}`).join("\n")}

Provide helpful information about these items in response to the customer's query. Include:
- Item names and descriptions
- Prices
- Any dietary information you can infer from descriptions
- Recommendations if appropriate

Be concise but informative.
    `

    const informationResult = await genAny({ model: modelAny, prompt: informationPrompt })

    return {
      information: getText(informationResult),
      relevantItems,
    }
  },
)
