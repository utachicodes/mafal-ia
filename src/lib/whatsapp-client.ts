import { env } from "./env"

export class WhatsAppClient {
  private static readonly BASE_URL = "https://graph.facebook.com/v18.0"
  private static async fetchWithRetry(url: string, init: RequestInit, maxRetries = 3): Promise<Response> {
    let attempt = 0
    let lastError: any
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(url, init)
        if (res.ok) return res
        // Retry on 429/5xx
        if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
          const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 250), 8000)
          await new Promise((r) => setTimeout(r, backoff))
          attempt++
          continue
        }
        return res
      } catch (err) {
        lastError = err
        const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 250), 8000)
        await new Promise((r) => setTimeout(r, backoff))
        attempt++
      }
    }
    throw lastError
  }

  // Send a text message via WhatsApp Business API
  static async sendMessage(
    businessPhoneNumberId: string,
    to: string,
    message: string,
    accessTokenOverride?: string,
  ): Promise<{ success: boolean; messageId?: string; raw?: any; errorText?: string; status?: number }> {
    try {
      const url = `${this.BASE_URL}/${businessPhoneNumberId}/messages`

      const payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: message,
        },
      }

      console.log("[WhatsApp API] Sending message:", {
        to,
        message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      })

      const token = accessTokenOverride || env.WHATSAPP_ACCESS_TOKEN
      const response = await this.fetchWithRetry(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[WhatsApp API] Send message failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        return { success: false, errorText, status: response.status }
      }

      const result = await response.json()
      console.log("[WhatsApp API] Message sent successfully:", result)
      const msgId = result?.messages?.[0]?.id || result?.messages?.[0]?.message_id
      return { success: true, messageId: msgId, raw: result }
    } catch (error) {
      console.error("[WhatsApp API] Error sending message:", error)
      return { success: false, errorText: String(error) }
    }
  }

  // Send a template message (for notifications, confirmations, etc.)
  static async sendTemplateMessage(
    businessPhoneNumberId: string,
    to: string,
    templateName: string,
    languageCode = "en",
    parameters: string[] = [],
    accessTokenOverride?: string,
  ): Promise<{ success: boolean; messageId?: string; raw?: any; errorText?: string; status?: number }> {
    try {
      const url = `${this.BASE_URL}/${businessPhoneNumberId}/messages`

      const payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components: parameters.length
            ? [
                {
                  type: "body",
                  parameters: parameters.map((param) => ({
                    type: "text",
                    text: param,
                  })),
                },
              ]
            : undefined,
        },
      }

      console.log("[WhatsApp API] Sending template message:", {
        to,
        template: templateName,
        language: languageCode,
      })

      const token = accessTokenOverride || env.WHATSAPP_ACCESS_TOKEN
      const response = await this.fetchWithRetry(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[WhatsApp API] Send template message failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        return { success: false, errorText, status: response.status }
      }

      const result = await response.json()
      console.log("[WhatsApp API] Template message sent successfully:", result)
      const msgId = result?.messages?.[0]?.id || result?.messages?.[0]?.message_id
      return { success: true, messageId: msgId, raw: result }
    } catch (error) {
      console.error("[WhatsApp API] Error sending template message:", error)
      return { success: false, errorText: String(error) }
    }
  }

  // Mark a message as read
  static async markMessageAsRead(
    businessPhoneNumberId: string,
    messageId: string,
    accessTokenOverride?: string,
  ): Promise<boolean> {
    try {
      const url = `${this.BASE_URL}/${businessPhoneNumberId}/messages`

      const payload = {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }

      const token = accessTokenOverride || env.WHATSAPP_ACCESS_TOKEN
      const response = await this.fetchWithRetry(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error("[WhatsApp API] Mark as read failed:", response.status, response.statusText)
        return false
      }

      return true
    } catch (error) {
      console.error("[WhatsApp API] Error marking message as read:", error)
      return false
    }
  }

  // Get business profile information
  static async getBusinessProfile(businessPhoneNumberId: string, accessTokenOverride?: string): Promise<any> {
    try {
      const url = `${this.BASE_URL}/${businessPhoneNumberId}`

      const token = accessTokenOverride || env.WHATSAPP_ACCESS_TOKEN
      const response = await this.fetchWithRetry(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error("[WhatsApp API] Get business profile failed:", response.status, response.statusText)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("[WhatsApp API] Error getting business profile:", error)
      return null
    }
  }
}
