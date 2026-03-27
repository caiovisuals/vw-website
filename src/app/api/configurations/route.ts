import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { saveConfigSchema } from "@/_lib/validations/cars"
import { ok, created, notFound, handleRoute } from "@/_lib/utils/apiResponse"
import { requireAuth, getCurrentUser } from "@/_lib/utils/session"
import { generateShortCode } from "@/_lib/utils/auth"
import { Decimal } from "@prisma/client/runtime/library"

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        const user = await requireAuth()

        const configs = await prisma.savedConfiguration.findMany({
            where: { userId: user.id },
            include: { car: { select: { name: true, slug: true, imageUrl: true } } },
            orderBy: { updatedAt: "desc" },
        })

        return ok(configs)
    })
}

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const user = await requireAuth()

        const body = await req.json()
        const data = saveConfigSchema.parse(body)

        const car = await prisma.car.findUnique({
            where: { id: data.carId, isActive: true },
            include: {
                colors: { where: data.colorId ? { id: data.colorId } : { isDefault: true } },
                wheels: { where: data.wheelId ? { id: data.wheelId } : { isDefault: true } },
                seats:  { where: data.seatId  ? { id: data.seatId  } : { isDefault: true } },
                technologies: data.techIds.length ? { where: { id: { in: data.techIds } } } : false,
            },
        })

        if (!car) return notFound("Modelo não encontrado.")

        let total = Number(car.basePrice)
        if (car.colors[0])       total += Number(car.colors[0].price)
        if (car.wheels[0])       total += Number(car.wheels[0].price)
        if (car.seats[0])        total += Number(car.seats[0].price)
        if (car.technologies) {
            (car.technologies as { price: Decimal }[]).forEach(t => {
                total += Number(t.price)
            })
        }

        let code: string
        let attempts = 0
        do {
            code = generateShortCode()
            const exists = await prisma.savedConfiguration.findUnique({ where: { code } })
            if (!exists) break
            attempts++
        } while (attempts < 10)

        const config = await prisma.savedConfiguration.create({
            data: {
                userId: user.id,
                carId: data.carId,
                code: code!,
                colorId: data.colorId,
                wheelId: data.wheelId,
                seatId: data.seatId,
                techIds: data.techIds,
                totalPrice: new Decimal(total),
            },
        })

        return created({ code: config.code, totalPrice: config.totalPrice }, "Configuração salva!")
    })
}