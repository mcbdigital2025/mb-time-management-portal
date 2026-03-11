import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
];

// function isPublicPath(pathname: string) {
//   return (
//     PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon.ico") ||
//     pathname.startsWith("/images") ||
//     pathname.startsWith("/assets")
//   );
// }

function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/" ||
    pathname === "/contact" ||
    pathname === "/about" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

//   const token = request.cookies.get('auth_token')?.value;
  const token = request.cookies.get("jwtToken")?.value;
  console.log("🚀 ~ proxy ~ token:", token)
  const publicPath = isPublicPath(pathname);

  // logged in user should not revisit login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  // block unauthenticated access to private pages
  if (!publicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};