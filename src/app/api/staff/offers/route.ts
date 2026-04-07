import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"

export async function POST(req: NextRequest) {
    const body = await req.json()

    const offer = await prisma.offer.create({
        data: {
            ...body,
            price: Number(body.price),
            discount: body.discount ? Number(body.discount) : null,
            validUntil: body.validUntil ? new Date(body.validUntil) : null,
        },
    })

    return NextResponse.json(offer)
}

export async function DELETE(req: NextRequest) {}