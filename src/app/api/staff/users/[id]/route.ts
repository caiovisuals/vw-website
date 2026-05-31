import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, notFound, forbidden, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { auditLog } from "@/_lib/utils/auditLog"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { z } from "zod"

type Params = { params: Promise<{ id: string }> }

const updateRoleSchema = z.object({
    role: z.enum(["USER", "STAFF", "ADMIN"]),
})

export async function GET(_req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("STAFF")
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                lastLoginAt: true,
                emailVerified: true,
                savedConfigs: {
                    orderBy: { updatedAt: "desc" },
                    take: 5,
                    include: { car: { select: { name: true, slug: true } } },
                },
                leads: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    include: { car: { select: { name: true } } },
                },
                _count: {
                    select: { savedConfigs: true, leads: true },
                },
            },
        })

        if (!user) return notFound("Usuário não encontrado.")
        return ok(user)
    })
}

export async function PATCH(req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        const requester = await requireRole("ADMIN")
        const { id } = await params

        if (requester.id === id) return forbidden("Você não pode alterar seu próprio cargo.")

        const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
        if (!target) return notFound("Usuário não encontrado.")

        const body = await req.json()
        const { role } = updateRoleSchema.parse(body)

        const updated = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        })

        const { ip } = await getRequestMeta(req)
        await auditLog({
            actorId: requester.id,
            actorEmail: requester.email,
            action: "USER_ROLE_CHANGED",
            targetId: id,
            targetType: "User",
            metadata: { previousRole: target.role, newRole: role },
            ip,
        })

        return ok(updated, `Cargo alterado para ${role}.`)
    })
}