import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { carFiltersSchema, createCarSchema } from "@/_lib/validations/cars"
import { ok, created, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        const { ip } = await getRequestMeta(req)
        
        if (isRateLimited(ip, ip, "api").limited) {
            return Response.json({ success: false, error: "Rate limit excedido." }, { status: 429 }) as never
        }

        const { searchParams } = new URL(req.url)
        const filters = carFiltersSchema.parse({
            fuel: searchParams.getAll("fuel"),
            transmission: searchParams.getAll("transmission"),
            featured: searchParams.get("featured"),
            minPrice: searchParams.get("minPrice"),
            maxPrice: searchParams.get("maxPrice"),
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
        })

        const where = {
            isActive: true,
            ...(filters.fuel?.length ? { fuel: { in: filters.fuel } } : {}),
            ...(filters.transmission?.length ? { transmission: { in: filters.transmission } } : {}),
            ...(filters.featured !== undefined ? { isFeatured: filters.featured } : {}),
            ...(filters.minPrice || filters.maxPrice
                ? {
                    basePrice: {
                        ...(filters.minPrice ? { gte: filters.minPrice } : {}),
                        ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
                    },
                }
                : {}),
        }

        const skip = (filters.page - 1) * filters.limit

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where,
                skip,
                take: filters.limit,
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    tagline: true,
                    basePrice: true,
                    fuel: true,
                    transmission: true,
                    isElectric: true,
                    isFeatured: true,
                    year: true,
                    imageUrl: true,
                },
            }),
            prisma.car.count({ where }),
        ])

        return ok({
            cars,
            pagination: {
                total,
                page: filters.page,
                limit: filters.limit,
                pages: Math.ceil(total / filters.limit),
            },
        })
    })
}

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        await requireRole("ADMIN")

        const body = await req.json()
        const data = createCarSchema.parse(body)

        const car = await prisma.car.create({ data })

        return created(car, "Carro cadastrado com sucesso.")
    })
}