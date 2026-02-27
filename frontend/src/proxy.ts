import { auth } from "@/auth"

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isApiRoute = req.nextUrl.pathname.startsWith("/api")
    const isAuthRoute = req.nextUrl.pathname.startsWith("/auth") // or standard auth routes
    const isPublicRoute = req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/public")

    // Exclude API Routes
    if (isApiRoute) {
        return;
    }

    // Example rule: Un-authenticated users trying to access dashboard/profile -> Redirect to Login
    if (!isLoggedIn && !isPublicRoute) {
        // In Keycloak flow with NextAuth, hitting signin directly is easiest usually
        return Response.redirect(new URL("/api/auth/signin?callbackUrl=" + req.nextUrl.pathname, req.nextUrl));
    }
})
