import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  // Auth disabled — return mock admin user
  return NextResponse.json({
    id: "mock-admin",
    name: "Admin",
    email: "admin@mafalia.com",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}
