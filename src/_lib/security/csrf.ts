import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { env } from "./../env"

const CSRF_TOKEN_NAME = "csrf_token"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24
const TOKEN_LENGTH = 32

function generateCSRFToken(): string {
    const array = new Uint8Array(TOKEN_LENGTH)
    crypto.getRandomValues(array)
    return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
    const method = request.method.toUpperCase()
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return null

    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value
    const headerToken = request.headers.get("x-csrf-token")

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return NextResponse.json(
            { success: false, error: "Token CSRF inválido." },
            { status: 403 }
        )
    }

    return null
}

export async function getCSRFTokenForClient(): Promise<string> {
    const cookieStore = await cookies()
    let token = cookieStore.get(CSRF_TOKEN_NAME)?.value

    if (!token) {
        token = generateCSRFToken()

        cookieStore.set(CSRF_TOKEN_NAME, token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: COOKIE_MAX_AGE_SECONDS,
            path: "/",
        })
    }
    
    return token
}
