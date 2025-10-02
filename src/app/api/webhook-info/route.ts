import { NextResponse } from "next/server"
import { env } from "@/src/lib/env"

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
  const canonical = `${base}/api/whatsapp`

  return NextResponse.json({
    ok: true,
    webhook: {
      url: alias,
      canonical,
      verifyTokenEnv: "WHATSAPP_VERIFY_TOKEN",
      demoMode: env.DEMO_MODE,
      outbound: env.LAM_API_BASE_URL && env.LAM_API_KEY && env.LAM_SENDER_ID ? "lam" : "meta",
    },
    note: "Use the 'url' as your webhook endpoint in your provider. In DEMO_MODE, replies are sent via LAM if configured; otherwise via Meta Graph.",
  })
}
