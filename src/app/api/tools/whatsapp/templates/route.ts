import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "endpoint_decommissioned", message: "WhatsApp templates API is removed." },
    { status: 410 },
  )
}

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "endpoint_decommissioned", message: "WhatsApp templates API is removed." },
    { status: 410 },
  )
}
