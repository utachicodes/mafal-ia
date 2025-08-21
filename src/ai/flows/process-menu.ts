import { defineFlow } from "@genkit-ai/flow"
import { generate } from "@genkit-ai/ai"
import { googleAI } from "@genkit-ai/googleai"
import type { MenuItem } from "@/lib/data"

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
    inputSchema: {
      type: "object",
      properties: {
        jsonString: { type: "string" },
      },
      required: ["jsonString"],
    },
    outputSchema: {
      type: "object",
      properties: {
        menuItems: { type: "array" },
        errors: { type: "array", items: { type: "string" } },
        processedCount: { type: "number" },
      },
      required: ["menuItems", "errors", "processedCount"],
    },
  },
  async (input: ProcessMenuInput): Promise<ProcessMenuOutput> => {
    const { jsonString } = input
    const errors: string[] = []
    let menuItems: MenuItem[] = []

    try {
      // First, try to parse the JSON
      const parsed = JSON.parse(jsonString)

      if (!Array.isArray(parsed)) {
        errors.push("JSON must be an array of menu items")
        return { menuItems: [], errors, processedCount: 0 }
      }

      // Use AI to validate and normalize the menu items
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

Return a JSON array of valid menu items. Fix any issues:
- Generate IDs if missing
- Ensure prices are numbers
- Clean up descriptions
- Add default values for optional fields
- Skip items that can't be fixed

Return only the JSON array, no other text.
      `

      const validationResult = await generate({
        model: googleAI("gemini-1.5-flash"),
        prompt: validationPrompt,
      })

      const validatedItems = JSON.parse(validationResult.text().trim())

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
