import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const restaurantId = url.searchParams.get("restaurantId") || undefined
    const dateFromStr = url.searchParams.get("dateFrom") || undefined
    const dateToStr = url.searchParams.get("dateTo") || undefined
    const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined
    const dateTo = dateToStr ? new Date(dateToStr) : undefined

    const prisma = await getPrisma()
    const orders = await prisma.order.findMany({
      where: {
        ...(restaurantId ? { restaurantId } : {}),
        ...(dateFrom || dateTo
          ? {
              createdAt: {
                ...(dateFrom ? { gte: dateFrom } : {}),
                ...(dateTo ? { lte: dateTo } : {}),
              },
            }
          : {}),
      },
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

    const restaurantId: string = String(body.restaurantId)
    const customerName: string = String(body.customerName)
    const phoneNumber: string = String(body.phoneNumber)
    const items: Array<{ itemName: string; quantity: number; price: number; specs?: any }> = body.items || []
    const notes: string | null = body.notes ? String(body.notes) : null

    if (!restaurantId || !customerName || !phoneNumber || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const total = items.reduce((sum, it) => sum + Math.round((it.price || 0) * (it.quantity || 0)), 0)

    const created = await prisma.order.create({
      data: {
        restaurantId,
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
