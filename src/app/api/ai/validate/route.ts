import { NextResponse } from "next/server"
import { extractApiKeyFromHeaders, validateApiKey } from "@/src/lib/api-auth"

export async function POST(req: Request) {
  try {
    const key = extractApiKeyFromHeaders(req.headers)
    if (!key) {
      return NextResponse.json({ ok: false, error: "Missing API key" }, { status: 400 })
    }
    const result = await validateApiKey(key)
    if (!result.valid) {
      return NextResponse.json({ ok: false, error: result.reason || "Invalid API key" }, { status: 401 })
    }
    return NextResponse.json({ ok: true, restaurantId: result.restaurantId })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Validation failed" }, { status: 500 })
  }
}
