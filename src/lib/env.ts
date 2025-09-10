export const env = {
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || "",
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || "mafal_verify_token_2024",
  WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET || "",
  // Optional: dedicated concierge number that routes to multi-restaurant assistant
  WHATSAPP_CONCIERGE_PHONE_NUMBER_ID: process.env.WHATSAPP_CONCIERGE_PHONE_NUMBER_ID || "",
  GOOGLE_GENKIT_API_KEY: process.env.GOOGLE_GENKIT_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  // Demo mode defaults to OFF unless explicitly enabled (DEMO_MODE=true or 1)
  DEMO_MODE:
    ((process.env.DEMO_MODE ?? "false") === "true" || (process.env.DEMO_MODE ?? "false") === "1") as boolean,
} as const

// Validation function to ensure required environment variables are set
export function validateEnv() {
  // In demo mode we don't enforce credentials
  if (env.DEMO_MODE) return

  const requiredVars = ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_APP_SECRET", "GOOGLE_GENKIT_API_KEY"] as const

  for (const varName of requiredVars) {
    if (!env[varName]) {
      throw new Error(`${varName} environment variable is required`)
    }
  }
}
