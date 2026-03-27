import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { updateCarSchema } from "@/_lib/validations/cars"
import { ok, notFound, noContent, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        const { slug } = await params

        const car = await prisma.car.findUnique({
            where: { slug, isActive: true },
            include: {
                colors: true,
                wheels: true,
                seats: true,
                technologies: true,
                technicalData: true,
            },
        })

        if (!car) return notFound("Modelo não encontrado.")
        return ok(car)
    })
}

export async function PATCH(req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("ADMIN")
        const { slug } = await params

        const car = await prisma.car.findUnique({ where: { slug }, select: { id: true } })
        if (!car) return notFound()

        const body = await req.json()
        const data = updateCarSchema.parse(body)

        const updated = await prisma.car.update({ where: { slug }, data })
        return ok(updated, "Carro atualizado.")
    })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    return handleRoute(async () => {
        await requireRole("ADMIN")
        const { slug } = await params

        const car = await prisma.car.findUnique({ where: { slug }, select: { id: true } })
        if (!car) return notFound()

        await prisma.car.update({ where: { slug }, data: { isActive: false } })
        return noContent()
    })
}