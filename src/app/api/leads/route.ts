import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { leadSchema } from "@/_lib/validations/cars"
import { ok, created, handleRoute } from "@/_lib/utils/apiResponse"
import { getCurrentUser, requireRole } from "@/_lib/utils/session"
import { isRateLimited } from "@/_lib/security/rateLimit"
import { getRequestMeta } from "@/_lib/security/requestHelpers"
import { z } from "zod"

const leadQuerySchema = z.object({
    status:   z.enum(["PENDING", "CONTACTED", "CONVERTED", "LOST"]).optional(),
    dealerId: z.string().cuid().optional(),
    carId:    z.string().cuid().optional(),
    page:     z.coerce.number().int().positive().default(1),
    limit:    z.coerce.number().int().min(1).max(100).default(20),
})

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const { ip } = await getRequestMeta(req)

        const rl = isRateLimited(ip, `lead:${ip}`, "auth")
        if (rl.limited) {
            return Response.json(
                { success: false, error: "Muitas solicitações. Aguarde alguns minutos." },
                { status: 429 }
            ) as never
        }

        const body = await req.json()
        const data = leadSchema.parse(body)

        const user = await getCurrentUser()

        const lead = await prisma.lead.create({
            data: {
                ...data,
                userId: user?.id ?? null,
                phone: data.phone || null,
                message: data.message || null,
            },
        })

        return created({ id: lead.id }, "Solicitação enviada! Em breve entraremos em contato.")
    })
}

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        await requireRole("STAFF")

        const { searchParams } = new URL(req.url)
        const query = leadQuerySchema.parse({
            status:   searchParams.get("status")   ?? undefined,
            dealerId: searchParams.get("dealerId") ?? undefined,
            carId:    searchParams.get("carId")    ?? undefined,
            page:     searchParams.get("page"),
            limit:    searchParams.get("limit"),
        })

        const where = {
            ...(query.status   ? { status:   query.status   } : {}),
            ...(query.dealerId ? { dealerId: query.dealerId } : {}),
            ...(query.carId    ? { carId:    query.carId    } : {}),
        }

        const skip = (query.page - 1) * query.limit

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: { createdAt: "desc" },
                include: {
                    car:    { select: { name: true, slug: true } },
                    dealer: { select: { name: true, city: true } },
                    user:   { select: { name: true, email: true } },
                },
            }),
            prisma.lead.count({ where }),
        ])

        return ok({
            leads,
            pagination: {
                total,
                page: query.page,
                limit: query.limit,
                pages: Math.ceil(total / query.limit),
            },
        })
    })
}