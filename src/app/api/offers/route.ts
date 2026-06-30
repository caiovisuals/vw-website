import { NextRequest, NextResponse } from "next/server"
import { OfferCategory, OfferType } from "@prisma/client"
import { prisma } from "@/_lib/prisma"
import { ok, tooManyRequests, handleRoute } from "@/_lib/utils/apiResponse"
import { isRateLimited, rateLimitHeaders } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { z } from "zod"

const offerQuerySchema = z.object({
    category: z.enum(["hatch", "suv", "sedan", "picape"]).optional(),
    model: z.string().max(80).optional(),
    type: z.enum(["novo", "seminovo"]).optional(),
})

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        const { ip } = await getRequestMeta(req)

        const rl = await isRateLimited(ip, ip, "api")
        if (rl.limited) {
            return tooManyRequests("Rate limit excedido.", rateLimitHeaders(rl))
        }
        
        const { searchParams } = new URL(req.url)

        const category = searchParams.get("category")
        const model = searchParams.get("model")
        const type = searchParams.get("type")

        const offers = await prisma.offer.findMany({
            where: {
                active: true,
                ...(category && { category: category as OfferCategory }),
                ...(model && { model }),
                ...(type && { type: type as OfferType }),
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return ok(offers)
    })
}