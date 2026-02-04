import { NextResponse } from "next/server"

export async function GET() {
  // Authentication disabled - return mock user data
  return NextResponse.json({
    id: "mock-user-id",
    name: "Demo User",
    email: "demo@mafal-ia.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}