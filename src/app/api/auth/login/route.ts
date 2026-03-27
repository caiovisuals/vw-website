import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { verifyPassword, generateSecureToken, getSessionExpiry, buildSessionCookieOptions } from "@/_lib/utils/auth"
import { loginSchema } from "@/_lib/validations/auth"
import { ok, unauthorized, handleRoute } from "@/_lib/utils/apiResponse"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { SESSION_COOKIE } from "@/_lib/utils/session"

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const { ip, userAgent } = await getRequestMeta(req)

        const rl = isRateLimited(ip, ip, "auth")
        if (rl.limited) {
            return Response.json(
                { success: false, error: "Muitas tentativas. Aguarde alguns minutos." },
                { status: 429 }
            ) as never
        }

        const body = await req.json()
        const data = loginSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email: data.email },
            select: { id: true, name: true, email: true, role: true, passwordHash: true, avatarUrl: true },
        })

        const GENERIC_ERROR = "E-mail ou senha incorretos."

        if (!user || !user.passwordHash) {
            await verifyPassword("dummy", "$2b$12$dummyhashfortimingattackprevention")
            return unauthorized(GENERIC_ERROR)
        }

        const valid = await verifyPassword(data.password, user.passwordHash)
        if (!valid) return unauthorized(GENERIC_ERROR)

        const token = generateSecureToken()
        const expiresAt = getSessionExpiry()

        await prisma.session.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
                ipAddress: ip,
                userAgent,
            },
        })

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        })

        const { passwordHash: _, ...safeUser } = user

        const response = ok(safeUser, "Login realizado com sucesso.")
        response.cookies.set(SESSION_COOKIE, token, buildSessionCookieOptions())
        return response
    })
}