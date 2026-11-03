import type { MetadataRoute } from "next"
import { prisma } from "@/_lib/prisma"
import { SITE_URL } from "@/_lib/utils/siteUrl"

// Regenera o sitemap a cada hora para refletir carros novos/desativados.
export const revalidate = 3600

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>

const STATIC_ROUTES: { path: string; changeFrequency: ChangeFrequency; priority: number }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/build-your-model", changeFrequency: "weekly", priority: 0.9 },
    { path: "/build-your-model/setting", changeFrequency: "weekly", priority: 0.8 },
    { path: "/sales-and-finance/offers", changeFrequency: "daily", priority: 0.9 },
    { path: "/sales-and-finance/finance", changeFrequency: "monthly", priority: 0.7 },
    { path: "/sales-and-finance/consortium", changeFrequency: "monthly", priority: 0.7 },
    { path: "/sales-and-finance/pre-owned", changeFrequency: "weekly", priority: 0.7 },
    { path: "/dealers", changeFrequency: "monthly", priority: 0.7 },
    { path: "/terms-of-use", changeFrequency: "yearly", priority: 0.2 },
    { path: "/privacy-policies", changeFrequency: "yearly", priority: 0.2 },
    { path: "/legal-information", changeFrequency: "yearly", priority: 0.2 },
]

async function getActiveCars() {
    try {
        return await prisma.car.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
            orderBy: { name: "asc" },
        })
    } catch (error) {
        // Sem banco disponível (ex.: build local), publica só as rotas estáticas.
        console.error("[sitemap] falha ao buscar carros:", error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()
    const cars = await getActiveCars()

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
        url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))

    const carEntries: MetadataRoute.Sitemap = cars.flatMap((car) => [
        {
            url: `${SITE_URL}/car/${car.slug}`,
            lastModified: car.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/build-your-model/setting/${car.slug}`,
            lastModified: car.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        },
    ])

    return [...staticEntries, ...carEntries]
}