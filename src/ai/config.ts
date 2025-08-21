import { env } from "@/src/lib/env"

// Genkit configuration
export const genkitConfig = {
  apiKey: env.GOOGLE_GENKIT_API_KEY,
  model: "gemini-1.5-flash",
  temperature: 0.7,
  maxTokens: 1000,
}

// Validate Genkit configuration
export function validateGenkitConfig() {
  if (!genkitConfig.apiKey) {
    throw new Error("GOOGLE_GENKIT_API_KEY environment variable is required")
  }
}

// Language detection configuration
export const supportedLanguages = {
  en: "English",
  fr: "French",
  wo: "Wolof",
  ar: "Arabic",
} as const

export type SupportedLanguage = keyof typeof supportedLanguages
