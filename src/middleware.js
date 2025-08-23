// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname.toLowerCase();

  const publicRoutes = ["/", "/login", "/signup"];

  // allow NextAuth flow APIs through
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();

  const cookies = req.cookies;
  const token = cookies.get("token")?.value;
  let authOk = false;

  if (token) {
    // If we have our own token, verify signature & expiry
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      authOk = true;
    } catch (err) {
      authOk = false;
    }
  } else {
    authOk = false;
  }

  // If user is logged in (has valid auth), **block** public routes and allow the rest
  if (authOk) {
    if (publicRoutes.includes(pathname)) {
      url.pathname = "/Home";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If not authenticated, allow ONLY public routes; otherwise redirect to /login
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
