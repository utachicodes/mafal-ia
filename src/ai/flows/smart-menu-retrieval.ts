import { defineFlow } from "@genkit-ai/flow"
import type { MenuItem } from "@/lib/data"
import { z } from "zod"
import Fuse from "fuse.js"
import { searchMenuItems } from "@/src/lib/data-utils"

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
    const { llm } = await import("@/src/lib/llm")

    // Step 1: Intelligent filtering using Fuse.js (Fuzzy Search)
    const fuse = new Fuse(menuItems, {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "category", weight: 0.2 },
        { name: "description", weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true
    })

    const fuseResults = fuse.search(query)
    let relevantItems = fuseResults.map((r: any) => r.item).slice(0, 5)

    if (relevantItems.length === 0) {
      relevantItems = searchMenuItems(menuItems, query).slice(0, 5)
    }

    if (relevantItems.length === 0 && menuItems.length < 20) {
      relevantItems = menuItems
    }

    if (relevantItems.length === 0) {
      return {
        information:
          "I couldn't find any menu items matching your specific query. Could you please check the spelling or ask about a different dish?",
        relevantItems: [],
      }
    }

    const informationPrompt = `
Customer query: "${query}"

Relevant menu items (Filtered from full menu):
${relevantItems.map((item: MenuItem) => `- ${item.name}: ${item.description} (${item.price} FCFA)${item.category ? ` [${item.category}]` : ""}`).join("\n")}

Provide helpful information about these items in response to the customer's query. Include:
- Item names and descriptions
- Prices
- Any dietary information you can infer from descriptions
- Recommendations if appropriate

Be concise but informative. Speak naturally.
    `

    const informationResult = await llm.generate(informationPrompt, { model: "claude-haiku-4-5-20251001" })

    return {
      information: informationResult.trim(),
      relevantItems,
    }
  },
)
