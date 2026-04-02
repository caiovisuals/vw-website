import { NextRequest, NextResponse } from "next/server"
import { detectSuspiciousActivity } from "@/_lib/security/suspicious"
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

const ROLE_LEVEL: Record<string, number> = {
    USER:  0,
    STAFF: 1,
    ADMIN: 2,
}

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

function applySecurityHeaders(response: NextResponse, headers: Record<string, string>): void {
    for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value)
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (await detectSuspiciousActivity(req)) {
        return new NextResponse(
            JSON.stringify({ success: false, error: "Requisição bloqueada." }),
            { status: 403, headers: { "Content-Type": "application/json" } }
        )
    }
    
    const token = req.cookies.get(SESSION_COOKIE)?.value

    const role = token ? getRoleFromToken(token) : null

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

    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")

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
