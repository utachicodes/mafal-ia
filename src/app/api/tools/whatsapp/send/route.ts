import { NextResponse } from "next/server"
import { WhatsAppClient } from "@/src/lib/whatsapp-client"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const to = String(body.to || "")
    const message = String(body.message || "")
    const restaurantId = String(body.restaurantId || "")

    if (!restaurantId || !to || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const prisma = await getPrisma()
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { whatsappPhoneNumberId: true, whatsappAccessToken: true } })
    if (!r?.whatsappPhoneNumberId || !r.whatsappAccessToken) {
      return NextResponse.json({ error: "Restaurant is missing WhatsApp credentials" }, { status: 400 })
    }

    const res = await WhatsAppClient.sendMessage(r.whatsappPhoneNumberId, to, message, r.whatsappAccessToken)
    if (!res.success) {
      return NextResponse.json({ error: res.errorText || "Failed to send" }, { status: 502 })
    }
    return NextResponse.json({ ok: true, messageId: res.messageId, raw: res.raw })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}
