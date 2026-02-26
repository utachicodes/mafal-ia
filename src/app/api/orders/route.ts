import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export async function GET() {
  try {
    const prisma = await getPrisma()
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { restaurant: { select: { id: true, name: true } } },
    })
    return NextResponse.json(orders)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load orders" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prisma = await getPrisma()

    const businessId: string = String(body.businessId)
    const customerName: string = String(body.customerName)
    const phoneNumber: string = String(body.phoneNumber)
    const items: Array<{ itemName: string; quantity: number; price: number; specs?: any }> = body.items || []
    const notes: string | null = body.notes ? String(body.notes) : null

    if (!businessId || !customerName || !phoneNumber || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const total = items.reduce((sum, it) => sum + Math.round((it.price || 0) * (it.quantity || 0)), 0)

    const created = await prisma.order.create({
      data: {
        businessId,
        customerName,
        phoneNumber,
        items,
        total,
        notes,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create order" }, { status: 500 })
  }
}
