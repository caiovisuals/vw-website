import { NextRequest, NextResponse } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { SESSION_COOKIE } from "@/_lib/utils/session"

const AUTH_ROUTES = [
    "/api/me", 
    "/api/configurations",
    "/home",
    "/home/profile"
]

const STAFF_ROUTES = [
    "/api/staff/users",
    "/staff"
]

const AUTH_API_ROUTES = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password"
]

const PUBLIC_ROUTES = [
    "/api/cars",
    "/api/dealers",
    "/api/leads"
]

const ROLE_LEVEL: Record<string, number> = {
    USER:  0,
    STAFF: 1,
    ADMIN: 2,
}

const JWT_COOKIE = "vw_jwt" 

function getRoleFromToken(token: string): string | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.role
    } catch {
        return null
    }
}

function buildSecurityHeaders(nonce: string): Record<string, string> {
    const isProd = process.env.NODE_ENV === "production"

    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' maps.googleapis.com`,
    ].join("; ")

    return {
        "X-Frame-Options": "DENY",
        "Content-Security-Policy": csp,
        "X-Nonce": nonce,
        ...(isProd
            ? { "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload" }
            : {}),
    }
}

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
    
    const token = req.cookies.get(SESSION_COOKIE)?.value

    const role = token ? getRoleFromToken(token) : null

    const needsAuth  = AUTH_ROUTES.some(r  => pathname.startsWith(r))
    const needsStaff = STAFF_ROUTES.some(r => pathname.startsWith(r))
 
    if (needsAuth && !token) {
        const token = req.cookies.get(SESSION_COOKIE)?.value
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Não autorizado." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            )
        }
    }

    if (needsStaff) {
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Não autorizado." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            )
        }

        if (!role || ROLE_LEVEL[role] < ROLE_LEVEL.STAFF) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Acesso negado." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            )
        }
    }

    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64")

    const response = NextResponse.next()
    applySecurityHeaders(response, buildSecurityHeaders(nonce))
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

function applySecurityHeaders(response: NextResponse, headers: Record<string, string>): void {
    for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value)
    }
}

export const config = {
    matcher: [
        "/api/:path*",
        "/((?!_next/static|_next/image|favicon.ico|assets|fonts).*)",
    ],
}
