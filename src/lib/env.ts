export const env = {
  GOOGLE_GENKIT_API_KEY: process.env.GOOGLE_GENKIT_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  // Admin token for protecting privileged endpoints like API key management
  ADMIN_API_TOKEN: process.env.ADMIN_API_TOKEN || "",
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || "",
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  LAM_API_BASE_URL: process.env.LAM_API_BASE_URL || "",
  LAM_API_KEY: process.env.LAM_API_KEY || "",
  LAM_SENDER_ID: process.env.LAM_SENDER_ID || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
} as const

// Validation function to ensure required environment variables are set
export function validateEnv() {
  const requiredVars = ["GROQ_API_KEY", "DATABASE_URL"] as const

  for (const varName of requiredVars) {
    if (!env[varName]) {
      throw new Error(`${varName} environment variable is required`)
    }
  }
}
