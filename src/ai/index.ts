import { configureGenkit } from "@genkit-ai/core"
import { googleAI } from "@genkitx/googleai"
import { generateResponseFlow } from "./flows/generate-response"
import { getMenuItemInformationFlow } from "./flows/smart-menu-retrieval"
import { calculateOrderTotalFlow } from "./flows/calculate-order-total"
import { processMenuFlow } from "./flows/process-menu"

// Configure Genkit with Google AI
configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
})

// Export all flows
export { generateResponseFlow, getMenuItemInformationFlow, calculateOrderTotalFlow, processMenuFlow }

// Helper function to initialize Genkit (call this in your app startup)
export function initializeGenkit() {
  console.log("Genkit AI flows initialized")
}
