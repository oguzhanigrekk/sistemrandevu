import { auth } from "@/auth"

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)"],
}

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // @ts-ignore
    const userRole = req.auth?.user?.role

    console.log(`Middleware Trace: Path=${pathname}, LoggedIn=${isLoggedIn}, Role=${userRole}`);

    const isApiRoute = pathname.startsWith("/api")
    const isPublicRoute = pathname === "/" || pathname.startsWith("/public")

    // Auth and Register pages should be public/excluded from protection to avoid redirect loops
    const isAuthRelatedRoute =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/api/auth")

    // dashboard route protection
    const isDashboardRoute = pathname.startsWith("/dashboard")

    // Exclude API Routes
    if (isApiRoute) {
        return;
    }

    // Redirect logic:

    // 1. If not logged in and trying to access any non-public, non-auth route -> Login
    if (!isLoggedIn && !isPublicRoute && !isAuthRelatedRoute) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }

    // 2. If Branch Admin is on public home or login/register -> Redirect to Dashboard
    if (isLoggedIn && userRole === "branch_admin") {
        if (pathname === "/" || isAuthRelatedRoute) {
            return Response.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    // 3. Protect dashboard from non-branch-admins
    if (isDashboardRoute && userRole !== "branch_admin") {
        return Response.redirect(new URL("/", req.nextUrl));
    }
})
