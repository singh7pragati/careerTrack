import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "careertrack_session";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/applications",
  "/skills",
  "/certifications",
  "/goals",
  "/profile",
];

const AUTH_ROUTES = ["/login", "/signup"];

async function verifyToken(token: string, secretStr: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(secretStr.trim());
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return typeof payload.userId === "string";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authSecret = process.env.AUTH_SECRET;

  const isAuthenticated =
    Boolean(token && authSecret && authSecret.trim().length >= 32) &&
    (await verifyToken(token!, authSecret!));

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes have their own 401 handling)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
