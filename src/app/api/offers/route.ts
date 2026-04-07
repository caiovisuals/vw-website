import { NextRequest, NextResponse } from "next/server"
import { OfferCategory, OfferType } from "@prisma/client"
import { prisma } from "@/_lib/prisma"

export async function GET(req: NextRequest) {
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

    return NextResponse.json(offers)
}