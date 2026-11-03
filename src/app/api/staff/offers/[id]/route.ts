import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, noContent, notFound, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { updateOfferSchema } from "@/_lib/validations/offers"
import { auditLog } from "@/_lib/utils/auditLog"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        const actor = await requireRole("STAFF")
        const { id } = await params

        const exists = await prisma.offer.findUnique({ where: { id }, select: { id: true } })
        if (!exists) return notFound("Oferta não encontrada.")

        const data = updateOfferSchema.parse(await req.json())
        const offer = await prisma.offer.update({ where: { id }, data })

        const { ip } = await getRequestMeta(req)
        await auditLog({
            actorId: actor.id,
            actorEmail: actor.email,
            action: "OFFER_UPDATED",
            targetId: id,
            targetType: "Offer",
            metadata: { fields: Object.keys(data) },
            ip,
        })

        return ok(offer, "Oferta atualizada.")
    })
}

export async function DELETE(req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        const actor = await requireRole("STAFF")
        const { id } = await params

        const exists = await prisma.offer.findUnique({ where: { id }, select: { id: true, title: true } })
        if (!exists) return notFound("Oferta não encontrada.")

        await prisma.offer.delete({ where: { id } })

        const { ip } = await getRequestMeta(req)
        await auditLog({
            actorId: actor.id,
            actorEmail: actor.email,
            action: "OFFER_DELETED",
            targetId: id,
            targetType: "Offer",
            metadata: { title: exists.title },
            ip,
        })

        return noContent()
    })
}