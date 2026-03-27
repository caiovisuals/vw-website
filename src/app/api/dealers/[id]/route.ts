import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, notFound, noContent, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { z } from "zod"

type Params = { params: Promise<{ id: string }> }

const updateDealerSchema = z.object({
    name:    z.string().min(2).max(120).trim().optional(),
    address: z.string().min(5).max(200).trim().optional(),
    city:    z.string().min(2).max(80).trim().optional(),
    state:   z.string().length(2).toUpperCase().trim().optional(),
    zip:     z.string().regex(/^\d{5}-?\d{3}$/).optional(),
    phone:   z.string().regex(/^\+?[\d\s\-()]{8,20}$/).optional(),
    email:   z.string().email().optional(),
    lat:     z.number().min(-90).max(90).optional(),
    lng:     z.number().min(-180).max(180).optional(),
    isActive: z.boolean().optional(),
})

export async function GET(_req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        const { id } = await params

        const dealer = await prisma.dealer.findUnique({
            where: { id, isActive: true },
        })

        if (!dealer) return notFound("Concessionária não encontrada.")
        return ok(dealer)
    })
}

export async function PATCH(req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("ADMIN")
        const { id } = await params

        const dealer = await prisma.dealer.findUnique({ where: { id }, select: { id: true } })
        if (!dealer) return notFound()

        const body = await req.json()
        const data = updateDealerSchema.parse(body)

        const updated = await prisma.dealer.update({ where: { id }, data })
        return ok(updated, "Concessionária atualizada.")
    })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("ADMIN")
        const { id } = await params

        const dealer = await prisma.dealer.findUnique({ where: { id }, select: { id: true } })
        if (!dealer) return notFound()

        await prisma.dealer.update({ where: { id }, data: { isActive: false } })
        return noContent()
    })
}