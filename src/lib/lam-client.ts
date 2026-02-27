import { env } from "@/src/lib/env"

export type LamSendParams = {
  to: string
  text: string
}

export const LamClient = {
  async sendMessage({ to, text }: LamSendParams) {
    if (!env.LAM_API_BASE_URL || !env.LAM_API_KEY) {
      return { success: false, status: 400, errorText: "LAM not configured", raw: null, messageId: undefined }
    }

    const url = `${env.LAM_API_BASE_URL.replace(/\/$/, "")}/messages`
    const payload = {
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: text },
    }

    let attempt = 0
    let lastError: any
    while (attempt <= 3) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "LAM-API-KEY": env.LAM_API_KEY,
          },
          body: JSON.stringify(payload),
        })

        if (res.ok || (res.status >= 400 && res.status < 500)) {
          const data = await res.json().catch(() => null)
          const messageId = (data?.messages?.[0]?.id) || undefined
          return {
            success: res.ok,
            status: res.status,
            errorText: !res.ok ? (data?.error?.message || data?.message || String(res.status)) : undefined,
            raw: data,
            messageId,
          }
        }

        // Retry on 5xx / 429
        const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 250), 8000)
        await new Promise((r) => setTimeout(r, backoff))
        attempt++
      } catch (err) {
        lastError = err
        const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 250), 8000)
        await new Promise((r) => setTimeout(r, backoff))
        attempt++
      }
    }

    return {
      success: false,
      status: 0,
      errorText: String(lastError),
      raw: null,
      messageId: undefined,
    }
  },
}
