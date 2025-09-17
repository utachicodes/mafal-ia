import { NextResponse } from "next/server"
import { RestaurantService } from "@/src/lib/restaurant-service"
import type { Restaurant } from "@/lib/data"

export async function GET() {
  try {
    const list = await RestaurantService.getAllRestaurants()
    return NextResponse.json(list)
  } catch (err: any) {
    console.error("GET /api/restaurants failed:", err)
    // Fallback: return empty list so client can proceed without server DB
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Restaurant
    const created = await RestaurantService.createRestaurant(body as any)
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create restaurant" }, { status: 500 })
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "GET, POST, HEAD, OPTIONS",
    },
  })
}

