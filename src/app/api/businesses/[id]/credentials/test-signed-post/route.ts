import { NextResponse } from "next/server"
import crypto from "crypto"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const prisma = await getPrisma()

    const business = await prisma.business.findUnique({
      where: { id },
      select: { whatsappAppSecret: true, whatsappPhoneNumberId: true },
    })
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 })
    if (!business.whatsappAppSecret || !business.whatsappPhoneNumberId) {
      return NextResponse.json({ error: "App Secret and Phone Number ID are required" }, { status: 400 })
    }

    const payload = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [{
        changes: [{
          value: {
            metadata: { phone_number_id: business.whatsappPhoneNumberId },
            messages: [{
              type: "text",
              from: "15550000000",
              id: `test_${Date.now()}`,
              text: { body: "Test message from webhook tester" },
            }],
          },
          field: "messages",
        }],
      }],
    })

    const sig = "sha256=" + crypto.createHmac("sha256", business.whatsappAppSecret).update(payload).digest("hex")

    const webhookUrl = new URL(req.url)
    const baseUrl = `${webhookUrl.protocol}//${webhookUrl.host}`
    const targetUrl = `${baseUrl}/api/webhook/whatsapp`

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": sig,
      },
      body: payload,
    })

    const body = await response.text()
    return NextResponse.json({ ok: response.ok, status: response.status, body })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Signed POST test failed" }, { status: 500 })
  }
}
