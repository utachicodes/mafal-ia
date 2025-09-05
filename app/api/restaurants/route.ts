import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "GET request received" })
}

export async function POST(req: Request) {
  return NextResponse.json({ message: "POST request received" }, { status: 201 })
}