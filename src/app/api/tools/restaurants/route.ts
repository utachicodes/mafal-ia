import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"

export const runtime = "nodejs"

export async function GET() {
  try {
    const prisma = await getPrisma()
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    })
    return NextResponse.json({ ok: true, restaurants })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to fetch" }, { status: 500 })
  }
}
