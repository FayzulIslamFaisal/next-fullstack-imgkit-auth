import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log("🛡️ Middleware called for:", req.nextUrl.pathname)
    console.log("🔑 Token exists:", !!req.nextauth.token)

    // যদি token না থাকে এবং protected route এ যাচ্ছে
    if (!req.nextauth.token) {
      console.log("❌ No token found, redirecting to login")
      return NextResponse.redirect(new URL("/login", req.url))
    }

    console.log("✅ Token found, allowing access")
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("🔍 Authorized callback - Path:", req.nextUrl.pathname)
        console.log("🔑 Token in authorized:", !!token)

        // সব protected routes এর জন্য token চেক করুন
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  },
)

export const config = {
  matcher: [
    // Protected routes
    "/admin/:path*",
    "/dashboard/:path*",
    "/about",
    // API routes যদি protect করতে চান
    "/api/admin/:path*",
    "/api/dashboard/:path*",
  ],
}
