import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // No authentication - allow all requests
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/restaurants/:path*", 
    "/orders/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
}
