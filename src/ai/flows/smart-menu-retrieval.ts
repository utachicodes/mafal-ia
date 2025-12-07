import { defineFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkit-ai/googleai"
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

    // Step 1: Intelligent filtering using Fuse.js (Fuzzy Search) + Simple Keyword Match
    // This allows us to handle 1000+ items without blowing up the context window.
    // Configure Fuse for name and description search
    const fuse = new Fuse(menuItems, {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "category", weight: 0.2 },
        { name: "description", weight: 0.1 }
      ],
      threshold: 0.4, // Lower is stricter
      includeScore: true
    })

    const fuseResults = fuse.search(query)
    let relevantItems = fuseResults.map((r: any) => r.item).slice(0, 5) // Take top 5

    // Fallback: If fuzzy search failed (e.g. general query like "drinks"), try category filter
    if (relevantItems.length === 0) {
      relevantItems = searchMenuItems(menuItems, query).slice(0, 5)
    }

    // If still no items, but the menu is small (<20 items), just use the whole menu
    if (relevantItems.length === 0 && menuItems.length < 20) {
      relevantItems = menuItems
    }

    // Generate detailed information about the relevant items
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

    const informationResult = await genAny({ model: modelAny, prompt: informationPrompt })

    return {
      information: getText(informationResult),
      relevantItems,
    }
  },
)
