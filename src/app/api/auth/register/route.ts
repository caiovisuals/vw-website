import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { hashPassword } from "@/_lib/utils/auth"
import { registerSchema } from "@/_lib/validations/auth"
import { ok, conflict, handleRoute } from "@/_lib/utils/apiResponse"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const { ip } = await getRequestMeta(req)

        const rl = isRateLimited(ip, ip, "auth")
        if (rl.limited) {
            return Response.json(
                { success: false, error: "Muitas tentativas. Aguarde alguns minutos." },
                { status: 429 }
            ) as never
        }
 
        const body = await req.json()
        const data = registerSchema.parse(body)
 
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
            select: { id: true },
        })
        if (existing) return conflict("Este e-mail já está cadastrado.")
 
        const passwordHash = await hashPassword(data.password)
 
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                phone: data.phone || null,
            },
            select: { id: true, name: true, email: true, role: true },
        })
 
        return ok(user, "Conta criada com sucesso.", 201)
    })
}