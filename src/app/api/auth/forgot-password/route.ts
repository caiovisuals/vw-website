import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { generateSecureToken, getResetTokenExpiry } from "@/_lib/utils/auth"
import { forgotPasswordSchema } from "@/_lib/validations/auth"
import { ok, handleRoute } from "@/_lib/utils/apiResponse"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { sendPasswordResetEmail } from "@/_lib/utils/email"
import { env } from "@/_lib/env"

const GENERIC_MSG = "Se o e-mail estiver cadastrado, você receberá um link de recuperação em breve."

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const { ip } = await getRequestMeta(req)
        
        const rl = await isRateLimited(ip, `forgot:${ip}`, "auth")
        if (rl.limited) return ok(null, GENERIC_MSG)

        const body = await req.json()
        const { email } = forgotPasswordSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true },
        })

        if (!user) return ok(null, GENERIC_MSG)

        await prisma.passwordReset.deleteMany({ where: { userId: user.id } })

        const token = generateSecureToken()
        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token,
                expiresAt: getResetTokenExpiry(),
            },
        })

        const resetUrl = `${env.NEXTAUTH_URL}/reset-password?token=${token}`
        try {
            await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl })
        } catch (err) {
            console.error("[forgot-password] falha ao enviar e-mail", err)
        }

        return ok(null, GENERIC_MSG)
    })
}