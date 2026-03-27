import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { hashPassword } from "@/_lib/utils/auth"
import { resetPasswordSchema } from "@/_lib/validations/auth"
import { ok, badRequest, handleRoute } from "@/_lib/utils/apiResponse"

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const body = await req.json()
        const { token, password } = resetPasswordSchema.parse(body)

        const reset = await prisma.passwordReset.findUnique({
            where: { token },
            include: { user: { select: { id: true } } },
        })

        if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
            return badRequest("Token inválido ou expirado. Solicite um novo link.")
        }

        const passwordHash = await hashPassword(password)

        await prisma.$transaction([
            prisma.user.update({
                where: { id: reset.userId },
                data: { passwordHash },
            }),
            prisma.passwordReset.update({
                where: { token },
                data: { usedAt: new Date() },
            }),
            prisma.session.deleteMany({ where: { userId: reset.userId } }),
        ])

        return ok(null, "Senha alterada com sucesso. Faça login novamente.")
    })
}