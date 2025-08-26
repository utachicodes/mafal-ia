import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export async function GET() {
  try {
    const prisma = await getPrisma()
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        cuisine: true,
        whatsappNumber: true,
        isActive: true,
        createdAt: true,
      },
    })
    return NextResponse.json(restaurants)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load restaurants" }, { status: 500 })
  }
}
