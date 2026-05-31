import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { requireAuth } from "@/_lib/utils/session"
import { ok, forbidden, notFound, handleRoute } from "@/_lib/utils/apiResponse"
import { auditLog } from "@/_lib/utils/auditLog"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { SESSION_COOKIE } from "@/_lib/utils/session"
import { z } from "zod"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    return handleRoute(async () => {
        const requester = await requireAuth()
        const { userId } = await params

        if (requester.id !== userId && requester.role !== "ADMIN") {
            return forbidden()
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                lastLoginAt: true,
            },
        })

        if (!user) return notFound("Usuário não encontrado.")
        return ok(user)
    })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    return handleRoute(async () => {
        const requester = await requireAuth()
        const { userId } = await params

        if (requester.id !== userId && requester.role !== "ADMIN") {
            return forbidden()
        }

        const body = await req.json()

        const updateUserSchema = z.object({
            name:  z.string().min(2).max(80).trim().optional(),
            phone: z.string().regex(/^\+?[\d\s\-()]{8,20}$/).optional().or(z.literal("")),
        })

        const data = updateUserSchema.parse(body)

        const updated = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, name: true, email: true, phone: true },
        })

        return ok(updated, "Perfil atualizado.")
    })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    return handleRoute(async () => {
        const requester = await requireAuth()
        const { userId } = await params

        if (requester.id !== userId && requester.role !== "ADMIN") {
            return forbidden()
        }

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } })
        if (!user) return notFound("Usuário não encontrado.")

        const { ip } = await getRequestMeta(req)

        await prisma.user.delete({ where: { id: userId } })

        await auditLog({
            actorId: requester.id,
            actorEmail: requester.email,
            action: "ACCOUNT_DELETED",
            targetId: userId,
            targetType: "User",
            metadata: { deletedEmail: user.email, selfDelete: requester.id === userId },
            ip,
        })

        const response = ok(null, "Conta excluída com sucesso.")
        
        if (requester.id === userId) {
            response.cookies.set(SESSION_COOKIE, "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 0,
                path: "/",
            })
        }
        return response
    })
}