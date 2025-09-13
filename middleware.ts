import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages and public pages
        if (req.nextUrl.pathname.startsWith("/auth") || 
            req.nextUrl.pathname === "/" ||
            req.nextUrl.pathname.startsWith("/api/auth")) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/restaurants/:path*",
    "/orders/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/concierge/:path*",
    "/playground/:path*",
    "/onboarding/:path*"
  ]
}
