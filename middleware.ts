import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("🛡️ Middleware called");
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("🔑 Token:", token);
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};
