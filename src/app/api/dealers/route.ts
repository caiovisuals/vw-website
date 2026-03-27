import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, created, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { z } from "zod"

const dealerQuerySchema = z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
})

const createDealerSchema = z.object({
    name: z.string().min(2).max(120).trim(),
    address: z.string().min(5).max(200).trim(),
    city: z.string().min(2).max(80).trim(),
    state: z.string().length(2).toUpperCase().trim(),
    zip: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido.").optional(),
    phone: z.string().regex(/^\+?[\d\s\-()]{8,20}$/).optional(),
    email: z.string().email().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
})

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        const { ip } = await getRequestMeta(req)

        if (isRateLimited(ip, ip, "api").limited) {
            return Response.json({ success: false, error: "Rate limit excedido." }, { status: 429 }) as never
        }

        const { searchParams } = new URL(req.url)
        const query = dealerQuerySchema.parse({
            city: searchParams.get("city") ?? undefined,
            state: searchParams.get("state") ?? undefined,
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
        })

        const where = {
            isActive: true,
            ...(query.city  ? { city:  { contains: query.city,  mode: "insensitive" as const } } : {}),
            ...(query.state ? { state: { equals:   query.state, mode: "insensitive" as const } } : {}),
        }

        const skip = (query.page - 1) * query.limit

        const [dealers, total] = await Promise.all([
            prisma.dealer.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: [{ state: "asc" }, { city: "asc" }, { name: "asc" }],
            }),
            prisma.dealer.count({ where }),
        ])

        return ok({
            dealers,
            pagination: {
                total,
                page: query.page,
                limit: query.limit,
                pages: Math.ceil(total / query.limit),
            },
        })
    })
}

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        await requireRole("ADMIN")

        const body = await req.json()
        const data = createDealerSchema.parse(body)

        const dealer = await prisma.dealer.create({ data })
        return created(dealer, "Concessionária cadastrada.")
    })
}