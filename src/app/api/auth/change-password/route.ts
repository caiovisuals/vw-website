import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { changePasswordSchema } from "@/_lib/validations/auth"
import {
    ok,
    badRequest,
    tooManyRequests,
    handleRoute,
} from "@/_lib/utils/apiResponse"
import { requireAuth, SESSION_COOKIE } from "@/_lib/utils/session"
import {
    hashPassword,
    verifyPassword,
    generateSecureToken,
    getSessionExpiry,
    buildSessionCookieOptions,
} from "@/_lib/utils/auth"
import { isRateLimited, rateLimitHeaders } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const user = await requireAuth()
        const { ip, userAgent } = await getRequestMeta(req)

        const rl = await isRateLimited(ip, `change-password:${user.id}`, "auth")
        if (rl.limited) {
            return tooManyRequests("Muitas tentativas. Aguarde alguns minutos.", rateLimitHeaders(rl))
        }

        const body = await req.json()
        const data = changePasswordSchema.parse(body)

        const account = await prisma.user.findUnique({
            where: { id: user.id },
            select: { passwordHash: true },
        })

        if (!account?.passwordHash) {
            return badRequest("Esta conta não usa senha. Defina uma pela recuperação de senha.")
        }

        const valid = await verifyPassword(data.currentPassword, account.passwordHash)
        if (!valid) {
            return badRequest("Senha atual incorreta.", { currentPassword: "Senha atual incorreta." })
        }

        const passwordHash = await hashPassword(data.password)
        const token = generateSecureToken()
        const expiresAt = getSessionExpiry()

        // Troca a senha e derruba todas as sessões, inclusive a atual, emitindo
        // uma nova em seguida para que o usuário não precise refazer o login.
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { passwordHash },
            }),
            prisma.session.deleteMany({ where: { userId: user.id } }),
            prisma.session.create({
                data: {
                    userId: user.id,
                    token,
                    expiresAt,
                    ipAddress: ip,
                    userAgent,
                },
            }),
        ])

        const response = ok(null, "Senha alterada com sucesso.")
        response.cookies.set(SESSION_COOKIE, token, buildSessionCookieOptions())
        return response
    })
}