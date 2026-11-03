import { NextRequest, NextResponse } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"
import { isRateLimited, rateLimitHeaders } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { SESSION_COOKIE } from "@/_lib/utils/sessionConstants"
import { csrfProtection } from "@/_lib/security/csrf"

const PROTECTED_ROUTES = [
    "/api/me",
    "/api/configurations",
    "/api/staff",
    "/home",
    "/staff",
]

const AUTH_API_ROUTES = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
]

function buildSecurityHeaders(nonce: string): Record<string, string> {
    const isProd = process.env.NODE_ENV === "production"

    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' maps.googleapis.com${isProd ? "" : " 'unsafe-eval'"}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: maps.gstatic.com maps.googleapis.com *.googleapis.com",
        "connect-src 'self' maps.googleapis.com *.sentry.io",
        "font-src 'self' fonts.gstatic.com",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
    ].join("; ")

    return {
        "Content-Security-Policy": csp,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-Nonce": nonce,
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
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

function denyAccess(req: NextRequest, status: 401, error: string): NextResponse {
    if (req.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
            JSON.stringify({ success: false, error }),
            { status, headers: { "Content-Type": "application/json" } }
        )
    }

    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const { ip } = await getRequestMeta(req)

    if (await detectSuspiciousActivity(req)) {
        return new NextResponse(
            JSON.stringify({ success: false, error: "Requisição bloqueada." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
        )
    }

    if (AUTH_API_ROUTES.some(r => pathname.startsWith(r))) {
        const rl = await isRateLimited(ip, ip, "auth")
        if (rl.limited) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Muitas tentativas. Aguarde alguns minutos." }),
                {
                    status: 429,
                    headers: { "Content-Type": "application/json", ...rateLimitHeaders(rl) },
                }
            )
        }
    }

    if (pathname.startsWith("/api/")) {
        const rl = await isRateLimited(ip, ip, "general")
        if (rl.limited) {
            return new NextResponse(
                JSON.stringify({ success: false, error: "Rate limit excedido." }),
                {
                    status: 429,
                    headers: { "Content-Type": "application/json", ...rateLimitHeaders(rl) },
                }
            )
        }
    }

    if (pathname.startsWith("/api/") && pathname !== "/api/csrf") {
        const csrfError = await csrfProtection(req)
        if (csrfError) return csrfError
    }
    
    const token = req.cookies.get(SESSION_COOKIE)?.value
    const isProtected = PROTECTED_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`))
 
    if (isProtected && !token) {
        return denyAccess(req, 401, "Não autorizado.")
    }

    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64")
    const securityHeaders = buildSecurityHeaders(nonce)

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set("Content-Security-Policy", securityHeaders["Content-Security-Policy"])
    requestHeaders.set("x-nonce", nonce)

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    applySecurityHeaders(response, securityHeaders)

    return response
}

export const config = {
    matcher: [
        "/api/:path*",
        "/home/:path*",
        "/staff/:path*",
    ],
}
