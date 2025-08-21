import { generateResponseFlow } from "./flows/generate-response"
import { getMenuItemInformationFlow } from "./flows/smart-menu-retrieval"
import { calculateOrderTotalFlow } from "./flows/calculate-order-total"
import { processMenuFlow } from "./flows/process-menu"

// Export all flows
export { generateResponseFlow, getMenuItemInformationFlow, calculateOrderTotalFlow, processMenuFlow }
// No global initialization required; flows construct models as needed.
