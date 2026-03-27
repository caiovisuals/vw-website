import { NextRequest, NextResponse } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

const AUTH_ROUTES = ["/api/me", "/api/configurations"]
const STAFF_ROUTES = ["/api/staff", "/api/leads"]
const AUTH_API_ROUTES = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
]

const SESSION_COOKIE = "vw_session"

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const { ip } = await getRequestMeta(req)

    if (await detectSuspiciousActivity(req)) {
        return new NextResponse(
            JSON.stringify({ success: false, error: "Requisição bloqueada." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
        )
    }

    if (AUTH_API_ROUTES.some(r => pathname.startsWith(r))) {
        const rl = isRateLimited(ip, ip, "auth")
        if (rl.limited) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Muitas tentativas. Aguarde alguns minutos." }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
                    },
                }
            )
        }
    }

    if (pathname.startsWith("/api/")) {
        const rl = isRateLimited(ip, ip, "general")
        if (rl.limited) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Rate limit excedido." }),
                { status: 429, headers: { "Content-Type": "application/json" } }
            )
        }
    }

    const needsAuth  = AUTH_ROUTES.some(r  => pathname.startsWith(r))
    const needsStaff = STAFF_ROUTES.some(r => pathname.startsWith(r))
 
    if (needsAuth || needsStaff) {
        const token = req.cookies.get(SESSION_COOKIE)?.value
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Não autorizado." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            )
        }
    }

    const response = NextResponse.next()
 
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(self)"
    )

    if (process.env.NODE_ENV === "production") {
        response.headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload"
        )
    }

    return response
}

export const config = {
    matcher: [
        "/api/:path*",
        "/((?!_next/static|_next/image|favicon.ico|assets|fonts).*)",
    ],
}
