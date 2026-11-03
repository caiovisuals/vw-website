import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, noContent, notFound, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { updateOfferSchema } from "@/_lib/validations/offers"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("STAFF")
        const { id } = await params

        const exists = await prisma.offer.findUnique({ where: { id }, select: { id: true } })
        if (!exists) return notFound("Oferta não encontrada.")

        const data = updateOfferSchema.parse(await req.json())
        const offer = await prisma.offer.update({ where: { id }, data })

        return ok(offer, "Oferta atualizada.")
    })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("STAFF")
        const { id } = await params

        const exists = await prisma.offer.findUnique({ where: { id }, select: { id: true } })
        if (!exists) return notFound("Oferta não encontrada.")

        await prisma.offer.delete({ where: { id } })
        return noContent()
    })
}