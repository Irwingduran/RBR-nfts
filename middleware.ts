import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin"]
// Routes that require admin role
const adminRoutes = ["/admin"]
// Public routes that don't require auth
const publicRoutes = ["/login", "/"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("magic_did_token")?.value

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For admin routes, verify admin role
  if (isAdminRoute && token) {
    try {
      const response = await fetch(new URL("/api/auth/me", request.url), {
        headers: {
          Cookie: `magic_did_token=${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } else {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      console.error("[v0] Middleware error:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect to dashboard if accessing login with valid token
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|icon-.*\\.png|apple-icon\\.png|icon\\.svg).*)",
  ],
}
