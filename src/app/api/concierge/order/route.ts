import { NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/src/lib/order-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, phoneNumber, itemsSummary, notFoundItems, orderItems, total } = body || {}

    if (!businessId || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const record = await OrderService.createOrder({
      businessId: String(businessId),
      phoneNumber: String(phoneNumber || "concierge_demo"),
      itemsSummary: String(itemsSummary || orderItems.map((i: any) => `${i.quantity}x ${i.itemName}`).join(", ")),
      notFoundItems: String(notFoundItems || ""),
      orderItems: orderItems.map((i: any) => ({ itemName: String(i.itemName), quantity: Number(i.quantity || 1) })),
      total: Number(total || 0),
    })

    return NextResponse.json(record, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
