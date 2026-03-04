import { auth } from "@/auth"

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)"],
}

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    const isApiRoute = pathname.startsWith("/api")
    const isPublicRoute = pathname === "/" || pathname.startsWith("/public")

    // Auth and Register pages should be public/excluded from protection to avoid redirect loops
    const isAuthRelatedRoute =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/api/auth")

    // Exclude API Routes
    if (isApiRoute) {
        return;
    }

    // Redirect to login if not logged in and trying to access a protected route
    if (!isLoggedIn && !isPublicRoute && !isAuthRelatedRoute) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }
})
