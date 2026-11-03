import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { created, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { createOfferSchema } from "@/_lib/validations/offers"
import { auditLog } from "@/_lib/utils/auditLog"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const actor = await requireRole("STAFF")

        const data = createOfferSchema.parse(await req.json())
        const offer = await prisma.offer.create({ data })

        const { ip } = await getRequestMeta(req)
        await auditLog({
            actorId: actor.id,
            actorEmail: actor.email,
            action: "OFFER_CREATED",
            targetId: offer.id,
            targetType: "Offer",
            metadata: { title: offer.title, model: offer.model },
            ip,
        })

        return created(offer, "Oferta criada.")
    })
}