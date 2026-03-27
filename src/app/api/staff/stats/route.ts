import { NextRequest } from "next/server"
import { prisma } from "@/_lib/prisma"
import { ok, handleRoute } from "@/_lib/utils/apiResponse"
import { requireRole } from "@/_lib/utils/session"

export async function GET(_req: NextRequest) {
    return handleRoute(async () => {
        await requireRole("STAFF")

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

        const [
            totalUsers,
            newUsersThisMonth,
            newUsersLastMonth,
            totalLeads,
            leadsThisMonth,
            leadsLastMonth,
            leadsByStatus,
            totalCars,
            activeCars,
            totalDealers,
            recentLeads,
            topCars,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),

            prisma.lead.count(),
            prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.lead.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),

            prisma.lead.groupBy({
                by: ["status"],
                _count: { status: true },
            }),

            prisma.car.count(),
            prisma.car.count({ where: { isActive: true } }),

            prisma.dealer.count({ where: { isActive: true } }),

            prisma.lead.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    car:    { select: { name: true } },
                    dealer: { select: { name: true } },
                },
            }),

            prisma.lead.groupBy({
                by: ["carId"],
                _count: { carId: true },
                orderBy: { _count: { carId: "desc" } },
                take: 5,
                where: { carId: { not: null } },
            }),
        ])

        type TopCarRaw = { carId: string | null; _count: { carId: number } }
        type LeadStatus = { status: string; _count: { status: number } }

        const topCarIds = (topCars as TopCarRaw[])
            .map(c => c.carId)
            .filter((id): id is string => !!id)

        const topCarDetails = await prisma.car.findMany({
            where: { id: { in: topCarIds } },
            select: { id: true, name: true, imageUrl: true },
        })

        const topCarsHydrated = (topCars as TopCarRaw[])
            .filter((c): c is { carId: string; _count: { carId: number } } => !!c.carId)
            .map(c => ({
                carId: c.carId,
                count: c._count.carId,
                car: topCarDetails.find(d => d.id === c.carId) ?? null,
            }))

        const leadStatusMap = Object.fromEntries(
            leadsByStatus.map((l: LeadStatus) => [l.status, l._count.status])
        )

        return ok({
            users: {
                total: totalUsers,
                thisMonth: newUsersThisMonth,
                lastMonth: newUsersLastMonth,
                growth: newUsersLastMonth > 0
                    ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
                    : null,
            },
            leads: {
                total: totalLeads,
                thisMonth: leadsThisMonth,
                lastMonth: leadsLastMonth,
                growth: leadsLastMonth > 0
                    ? Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100)
                    : null,
                byStatus: {
                    pending:   leadStatusMap["PENDING"]   ?? 0,
                    contacted: leadStatusMap["CONTACTED"] ?? 0,
                    converted: leadStatusMap["CONVERTED"] ?? 0,
                    lost:      leadStatusMap["LOST"]      ?? 0,
                },
            },
            cars: {
                total: totalCars,
                active: activeCars,
            },
            dealers: {
                total: totalDealers,
            },
            recentLeads,
            topCars: topCarsHydrated,
        })
    })
}