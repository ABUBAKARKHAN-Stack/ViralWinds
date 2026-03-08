import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "./lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const key = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get(COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }

        try {
            await jwtVerify(token, key);
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware JWT verification failed:", error);
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
    }

    // Redirect /login to /admin/dashboard if already logged in
    if (pathname === "/auth/signin") {
        const token = request.cookies.get(COOKIE_NAME)?.value;
        if (token) {
            try {
                await jwtVerify(token, key);
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            } catch (error) {
                // Token invalid, allow access to login page
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};
