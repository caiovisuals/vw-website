import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, notFound, forbidden, handleRoute } from "@/_lib/utils/apiResponse"
import { requireAuth } from "@/_lib/utils/session"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    return handleRoute(async () => {
        const user = await requireAuth()
        const { code } = await params

        const config = await prisma.savedConfiguration.findUnique({
            where: { code: code.toUpperCase() },
            include: {
                car: {
                    select: { id: true, name: true, slug: true, imageUrl: true, basePrice: true },
                },
            },
        })

        if (!config) return notFound("Configuração não encontrada.")
        if (config.userId !== user.id && user.role !== "ADMIN") return forbidden()

        const [color, wheel, seat, technologies] = await Promise.all([
            config.colorId ? prisma.carColor.findUnique({ where: { id: config.colorId } }) : null,
            config.wheelId ? prisma.carWheel.findUnique({ where: { id: config.wheelId } }) : null,
            config.seatId ? prisma.carSeat.findUnique({ where: { id: config.seatId } }) : null,
            config.techIds.length
                ? prisma.carTechnology.findMany({ where: { id: { in: config.techIds } } })
                : [],
        ])

        return ok({ ...config, color, wheel, seat, technologies })
    })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    return handleRoute(async () => {
        const user = await requireAuth()
        const { code } = await params

        const config = await prisma.savedConfiguration.findUnique({
            where: { code: code.toUpperCase() },
            select: { id: true, userId: true },
        })

        if (!config) return notFound("Configuração não encontrada.")
        if (config.userId !== user.id && user.role !== "ADMIN") return forbidden()

        await prisma.savedConfiguration.delete({ where: { id: config.id } })

        return ok(null, "Configuração removida.")
    })
}