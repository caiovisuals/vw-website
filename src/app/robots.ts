import type { MetadataRoute } from "next"
import { SITE_URL } from "@/_lib/utils/siteUrl"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/home",
                    "/staff",
                    "/login",
                    "/register",
                    "/forgot-password",
                    "/reset-password",
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}