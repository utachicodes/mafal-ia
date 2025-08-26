import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const prisma = await getPrisma()
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { restaurant: { select: { id: true, name: true } } },
    })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load order" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const prisma = await getPrisma()

    const data: any = {}
    if (body.status) data.status = body.status
    if (body.notes !== undefined) data.notes = body.notes

    const updated = await prisma.order.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update order" }, { status: 500 })
  }
}
