export { default as middleware } from "next-auth/middleware"

// Protect dashboard and related routes
export const config = {
  matcher: ["/dashboard", "/settings/:path*", "/restaurants/:path*"],
}
