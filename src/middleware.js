// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname.toLowerCase();

  const publicRoutes = ["/", "/login", "/signup"];

  // ✅ Skip middleware for API auth routes (Google OAuth, etc.)
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // If logged in but visiting public routes → redirect to Home
  if (token && publicRoutes.includes(pathname)) {
    url.pathname = "/Home";
    return NextResponse.redirect(url);
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token → redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Verify token
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (err) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  // apply middleware to everything except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
