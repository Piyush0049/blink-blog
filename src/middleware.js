import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname.toLowerCase();

  const publicRoutes = ["/", "/login", "/signup"];

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const cookies = req.cookies;
  const token = cookies.get("token")?.value;
  let authOk = false;

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      authOk = true;
    } catch (err) {
      authOk = false;
    }
  } else {
    authOk = false;
  }

  if (authOk) {
    // if logged in and visiting public route → redirect to /Home
    if (publicRoutes.includes(pathname)) {
      url.pathname = "/Home";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // not logged in but visiting public route → allow
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // not logged in and trying to visit protected route → redirect to /login
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
