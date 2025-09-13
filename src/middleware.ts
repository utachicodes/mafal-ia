import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/restaurants/:path*",
    "/orders/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
}
