import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "endpoint_decommissioned", message: "WhatsApp send API is removed." },
    { status: 410 },
  )
}
