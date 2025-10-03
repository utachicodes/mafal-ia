export const env = {
  GOOGLE_GENKIT_API_KEY: process.env.GOOGLE_GENKIT_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  // Admin token for protecting privileged endpoints like API key management
  ADMIN_API_TOKEN: process.env.ADMIN_API_TOKEN || "",
} as const

// Validation function to ensure required environment variables are set
export function validateEnv() {
  const requiredVars = ["GOOGLE_GENKIT_API_KEY", "DATABASE_URL"] as const

  for (const varName of requiredVars) {
    if (!env[varName]) {
      throw new Error(`${varName} environment variable is required`)
    }
  }
}
