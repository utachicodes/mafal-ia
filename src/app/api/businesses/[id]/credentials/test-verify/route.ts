import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const prisma = await getPrisma()

    const business = await prisma.business.findUnique({
      where: { id },
      select: { webhookVerifyToken: true },
    })
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 })
    if (!business.webhookVerifyToken) {
      return NextResponse.json({ error: "No verify token set for this business" }, { status: 400 })
    }

    const challenge = "challenge_" + Math.random().toString(36).slice(2)
    const webhookUrl = new URL(req.url)
    const baseUrl = `${webhookUrl.protocol}//${webhookUrl.host}`
    const requestedUrl = `${baseUrl}/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(business.webhookVerifyToken)}&hub.challenge=${challenge}`

    const response = await fetch(requestedUrl, { method: "GET" })
    const body = await response.text()
    const passed = body.trim() === challenge

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      body,
      passed,
      requestedUrl,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Test failed" }, { status: 500 })
  }
}
