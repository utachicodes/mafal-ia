import { env } from "./env"

export class WhatsAppClient {
  private static readonly BASE_URL = "https://graph.facebook.com/v18.0"

  // Send a text message via WhatsApp Business API
  static async sendMessage(
    businessPhoneNumberId: string,
    to: string,
    message: string,
    accessTokenOverride?: string,
  ): Promise<boolean> {
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
      const response = await fetch(url, {
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
        return false
      }

      const result = await response.json()
      console.log("[WhatsApp API] Message sent successfully:", result)
      return true
    } catch (error) {
      console.error("[WhatsApp API] Error sending message:", error)
      return false
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
  ): Promise<boolean> {
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
      const response = await fetch(url, {
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
        return false
      }

      const result = await response.json()
      console.log("[WhatsApp API] Template message sent successfully:", result)
      return true
    } catch (error) {
      console.error("[WhatsApp API] Error sending template message:", error)
      return false
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
      const response = await fetch(url, {
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
      const response = await fetch(url, {
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
