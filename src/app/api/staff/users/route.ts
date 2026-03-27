import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"
import { z } from "zod"

const querySchema = z.object({
    search: z.string().optional(),
    role:   z.enum(["USER", "STAFF", "ADMIN"]).optional(),
    page:   z.coerce.number().int().positive().default(1),
    limit:  z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        await requireRole("STAFF")

        const { searchParams } = new URL(req.url)
        const query = querySchema.parse({
            search: searchParams.get("search") ?? undefined,
            role:   searchParams.get("role")   ?? undefined,
            page:   searchParams.get("page"),
            limit:  searchParams.get("limit"),
        })

        const where = {
            ...(query.role ? { role: query.role } : {}),
            ...(query.search
                ? {
                    OR: [
                        { name:  { contains: query.search, mode: "insensitive" as const } },
                        { email: { contains: query.search, mode: "insensitive" as const } },
                    ],
                }
                : {}),
        }

        const skip = (query.page - 1) * query.limit

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phone: true,
                    createdAt: true,
                    lastLoginAt: true,
                    emailVerified: true,
                    _count: {
                        select: {
                            savedConfigs: true,
                            leads: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ])

        return ok({
            users,
            pagination: {
                total,
                page: query.page,
                limit: query.limit,
                pages: Math.ceil(total / query.limit),
            },
        })
    })
}