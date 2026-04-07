import { NextRequest, NextResponse } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { SESSION_COOKIE } from "@/_lib/utils/session"
import { csrfProtection } from "@/_lib/security/csrf"
import { jwtVerify } from "jose"

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

const ROLE_LEVEL: Record<string, number> = {
    USER:  0,
    STAFF: 1,
    ADMIN: 2,
}

async function getRoleFromToken(token: string): Promise<string | null> {
    try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
        const { payload } = await jwtVerify(token, secret)
        return typeof payload.role === "string" ? payload.role : null
    } catch {
        return null
    }
}

function buildSecurityHeaders(nonce: string): Record<string, string> {
    const isProd = process.env.NODE_ENV === "production"

    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' maps.googleapis.com`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "connect-src 'self'",
    ].join("; ")

    return {
        "Content-Security-Policy": csp,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-Nonce": nonce,
        ...(isProd
            ? { "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload" }
            : {}),
    }
}

function applySecurityHeaders(response: NextResponse, headers: Record<string, string>): void {
    for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value)
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

    if (pathname.startsWith("/api/")) {
        const csrfError = await csrfProtection(req)
        if (csrfError) return csrfError
    }
    
    const token = req.cookies.get(SESSION_COOKIE)?.value
    const role = token ? await getRoleFromToken(token) : null

    const needsAuth  = AUTH_ROUTES.some(r  => pathname.startsWith(r))
    const needsStaff = STAFF_ROUTES.some(r => pathname.startsWith(r))
 
    if (needsAuth && !token) {
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
        "/home/:path*",
        "/staff/:path*",
    ],
}
