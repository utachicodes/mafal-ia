import { defineFlow } from "@genkit-ai/flow"
import type { MenuItem } from "@/lib/data"
import { z } from "zod";

interface ProcessMenuInput {
  jsonString: string
}

interface ProcessMenuOutput {
  menuItems: MenuItem[]
  errors: string[]
  processedCount: number
}

// Utility flow to parse and validate menu from JSON
export const processMenuFlow = defineFlow(
  {
    name: "processMenu",
    inputSchema: z.object({
      jsonString: z.string(),
    }),
    outputSchema: z.object({
      menuItems: z.array(z.any()), // Partial typing for now to avoid complexity
      errors: z.array(z.string()),
      processedCount: z.number(),
    }),
  },
  async (input: ProcessMenuInput): Promise<ProcessMenuOutput> => {
    const { jsonString } = input
    const { llm } = await import("@/src/lib/llm")
    const errors: string[] = []
    let menuItems: MenuItem[] = []

    try {
      const parsed = JSON.parse(jsonString)

      if (!Array.isArray(parsed)) {
        errors.push("JSON must be an array of menu items")
        return { menuItems: [], errors, processedCount: 0 }
      }

      const validationPrompt = `
Validate and normalize this menu data. Each item should have:
- id (string): unique identifier
- name (string): dish name
- description (string): description of the dish
- price (number): price in FCFA
- category (string, optional): food category
- isAvailable (boolean, optional): defaults to true

Input data:
${JSON.stringify(parsed, null, 2)}

Respond with a JSON object containing "items" which is an array of valid menu items. Fix any issues:
- Generate IDs if missing
- Ensure prices are numbers
- Clean up descriptions
- Add default values for optional fields
- Skip items that can't be fixed
      `

      const validationResult = await llm.generate(validationPrompt, {
        model: "llama-3.3-70b-versatile",
        json: true
      })

      const parsedResult = JSON.parse(validationResult)
      const validatedItems = parsedResult.items || parsedResult

      if (Array.isArray(validatedItems)) {
        menuItems = validatedItems.filter((item) => {
          // Final validation
          if (!item.id || !item.name || !item.description || typeof item.price !== "number") {
            errors.push(`Invalid item skipped: ${item.name || "unnamed item"}`)
            return false
          }
          return true
        })
      }
    } catch (parseError) {
      errors.push("Invalid JSON format: " + (parseError as Error).message)
    }

    return {
      menuItems,
      errors,
      processedCount: menuItems.length,
    }
  },
)
