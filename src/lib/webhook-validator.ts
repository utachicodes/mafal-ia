import crypto from "crypto"

export class WebhookValidator {
  // Validate WhatsApp webhook signature (for enhanced security)
  static validateSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")
      const providedSignature = signature.replace("sha256=", "")

      return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(providedSignature))
    } catch (error) {
      console.error("[WebhookValidator] Signature validation error:", error)
      return false
    }
  }

  // Validate webhook payload structure
  static validatePayload(payload: any): boolean {
    try {
      // Basic structure validation
      if (!payload || typeof payload !== "object") {
        return false
      }

      // Check for required WhatsApp webhook fields
      if (!payload.entry || !Array.isArray(payload.entry)) {
        return false
      }

      return true
    } catch (error) {
      console.error("[WebhookValidator] Payload validation error:", error)
      return false
    }
  }

  // Extract phone number from WhatsApp message
  static extractPhoneNumber(message: any): string | null {
    try {
      return message?.from || null
    } catch (error) {
      console.error("[WebhookValidator] Phone number extraction error:", error)
      return null
    }
  }

  // Extract message text from WhatsApp message
  static extractMessageText(message: any): string | null {
    try {
      if (message?.type === "text" && message?.text?.body) {
        return message.text.body
      }
      return null
    } catch (error) {
      console.error("[WebhookValidator] Message text extraction error:", error)
      return null
    }
  }

  // Check if message is from a business account
  static isBusinessMessage(message: any): boolean {
    try {
      // Business messages typically have certain metadata
      return message?.context?.from || false
    } catch (error) {
      return false
    }
  }
}
