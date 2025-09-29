import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

const GRAPH_BASE = "https://graph.facebook.com/v18.0"
export const runtime = "nodejs"

// List templates for a business account using server-side token
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const businessAccountId = searchParams.get("businessAccountId")
    const restaurantId = searchParams.get("restaurantId")
    if (!businessAccountId || !restaurantId) {
      return NextResponse.json({ error: "businessAccountId and restaurantId required" }, { status: 400 })
    }
    const prisma = await getPrisma()
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { whatsappAccessToken: true } })
    const accessToken = r?.whatsappAccessToken
    if (!accessToken) return NextResponse.json({ error: "Restaurant missing access token" }, { status: 400 })

    const res = await fetch(`${GRAPH_BASE}/${businessAccountId}/message_templates`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data?.error?.message || "Failed to fetch" }, { status: res.status })
    return NextResponse.json({ ok: true, templates: data?.data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}

// Send a template message; token and phoneNumberId are resolved server-side by restaurantId
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const to: string = body.to
    const templateName: string = body.templateName
    const languageCode: string = body.languageCode || "en"
    const parameters: string[] = Array.isArray(body.parameters) ? body.parameters : []
    const restaurantId: string = body.restaurantId

    if (!restaurantId || !to || !templateName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const prisma = await getPrisma()
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { whatsappPhoneNumberId: true, whatsappAccessToken: true } })
    if (!r?.whatsappPhoneNumberId || !r.whatsappAccessToken) {
      return NextResponse.json({ error: "Restaurant missing WhatsApp credentials" }, { status: 400 })
    }

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: parameters.length
          ? [
              {
                type: "body",
                parameters: parameters.map((p) => ({ type: "text", text: String(p) })),
              },
            ]
          : undefined,
      },
    }

    const res = await fetch(`${GRAPH_BASE}/${r.whatsappPhoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${r.whatsappAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data?.error?.message || "Failed to send" }, { status: res.status })
    return NextResponse.json({ ok: true, result: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}
