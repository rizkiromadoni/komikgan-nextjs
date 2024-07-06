import { auth } from "@/auth";
import { NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];

export default auth((req) => {
    if (req.auth) {
        if (authRoutes.includes(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (req.auth.user.role === "USER") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    }

    if (!req.auth) {
        if (req.nextUrl.pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
