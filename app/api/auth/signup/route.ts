import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Redirect to register endpoint
  return NextResponse.redirect(new URL("/api/auth/register", request.url))
}
