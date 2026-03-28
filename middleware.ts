import { NextRequest, NextResponse } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

const AUTH_ROUTES = [
    "/api/me", 
    "/api/configurations",
    "/home",
    "/home/profile"
]

const STAFF_ROUTES = [
    "/api/staff/users"
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

const SESSION_COOKIE = "vw_session"
const JWT_COOKIE = "vw_jwt" 

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

function extractUserFromToken(token: string | undefined) {
    if (!token) return null
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const { ip } = await getRequestMeta(req)

    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64")

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
    const user = extractUserFromToken(token)

    const needsAuth  = AUTH_ROUTES.some(r  => pathname.startsWith(r))
    const needsStaff = STAFF_ROUTES.some(r => pathname.startsWith(r))
 
    if (needsAuth && !user) {
        const token = req.cookies.get(SESSION_COOKIE)?.value
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Não autorizado." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            )
        }
    }

    if (needsStaff && !user) {
        const token = req.cookies.get(SESSION_COOKIE)?.value
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Não autorizado." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            )
        }
    }

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
