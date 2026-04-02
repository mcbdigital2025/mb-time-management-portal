import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
];

function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/" ||
    pathname === "/contact" ||
    pathname === "/about" ||
    pathname === "/createemployee" ||
    // pathname === "/viewemployees" ||
    // pathname === "/updateemployee" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  );
}

function decodeToken(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const base64 = payloadBase64
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + (4 - (base64.length % 4)) % 4,
      "="
    );

    const payload = JSON.parse(atob(padded));

    return payload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

    const payload = JSON.parse(atob(padded));
    if (!payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const publicPath = isPublicPath(pathname);
  const token = request.cookies.get("jwtToken")?.value;

  // const hasValidToken = token && !isTokenExpired(token);

  const payload = token ? decodeToken(token) : null;
const isExpired = payload ? payload.exp <= Math.floor(Date.now() / 1000) : true;

const hasValidToken = payload && !isExpired;

const userRole = payload;
console.log("🚀 ~ proxy ~ userRole:", userRole)
const userId = payload?.sub; // or id depending on your backend

//   const token = request.cookies.get('auth_token')?.value;
  console.log("🚀 ~ proxy ~ token:", hasValidToken)

  if (hasValidToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

   if (!publicPath && !hasValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);

    if (token) {
      response.cookies.set("jwtToken", "", {
        path: "/",
        maxAge: 0,
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};