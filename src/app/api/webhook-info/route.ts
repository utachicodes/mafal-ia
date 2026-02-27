import { NextResponse } from "next/server"

export const runtime = "nodejs"

function deriveBaseUrl(headers: Headers): string {
  // Prefer explicit public base URL if set (e.g., Vercel/Cloud Run custom domain)
  const explicit = process.env.NEXT_PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  // Fallback to request headers (x-forwarded-*) then host
  const proto = headers.get("x-forwarded-proto") || "https"
  const host = headers.get("x-forwarded-host") || headers.get("host") || "localhost:3000"
  return `${proto}://${host}`.replace(/\/$/, "")
}

export async function GET(req: Request) {
  const base = deriveBaseUrl(new Headers(req.headers))
  const alias = `${base}/webhook/whatsapp`
  const canonical = `${base}/api/webhook/whatsapp`

  return NextResponse.json({
    ok: true,
    webhook: {
      url: alias,
      canonical,
      verifyTokenEnv: null,
      outbound: "http",
    },
    note: "WhatsApp webhook has been decommissioned. Use the chatbot HTTP endpoint /api/chatbots/[id]/messages.",
  })
}
