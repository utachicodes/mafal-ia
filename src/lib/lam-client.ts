import { env } from "@/src/lib/env"

export type LamSendParams = {
  to: string
  text: string
}

export const LamClient = {
  async sendMessage({ to, text }: LamSendParams) {
    if (!env.LAM_API_BASE_URL || !env.LAM_API_KEY || !env.LAM_SENDER_ID) {
      return { success: false, status: 400, errorText: "LAM not configured", raw: null, messageId: undefined }
    }

    const url = `${env.LAM_API_BASE_URL.replace(/\/$/, "")}/messages`
    const payload = {
      from: env.LAM_SENDER_ID,
      to,
      type: "text",
      text: { body: text },
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.LAM_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => null)
    const messageId = (data && (data.id || data.messageId)) || undefined

    return {
      success: res.ok,
      status: res.status,
      errorText: !res.ok ? (data?.error?.message || data?.message || String(res.status)) : undefined,
      raw: data,
      messageId,
    }
  },
}
