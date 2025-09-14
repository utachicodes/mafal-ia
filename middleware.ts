import { NextResponse } from "next/server"

export default function middleware() {
  // Auth disabled – allow all requests to proceed
  return NextResponse.next()
}

// Optional: keep matchers if you want to scope where middleware runs (no auth checks applied)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/restaurants/:path*",
    "/orders/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/concierge/:path*",
    "/playground/:path*",
    "/onboarding/:path*",
  ],
}
