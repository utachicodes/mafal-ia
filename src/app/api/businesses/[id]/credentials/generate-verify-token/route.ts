import { NextResponse } from "next/server"
import crypto from "crypto"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const prisma = await getPrisma()

    const business = await prisma.business.findUnique({ where: { id }, select: { id: true } })
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 })

    const token = "wv_" + crypto.randomBytes(24).toString("hex")
    await prisma.business.update({ where: { id }, data: { webhookVerifyToken: token } })

    return NextResponse.json({ webhookVerifyToken: token })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to generate token" }, { status: 500 })
  }
}
