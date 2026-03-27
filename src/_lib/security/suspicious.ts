import type { NextRequest } from "next/server"
import { getRequestMeta } from "./requestHelpers"

export async function detectSuspiciousActivity(req: NextRequest): Promise<boolean> {
    const { userAgent } = await getRequestMeta(req)
    const url = req.url

    if (url.length > 2048) return true

    const maliciousBots = [
        /sqlmap/i,
        /nikto/i,
        /nessus/i,
        /masscan/i,
        /nmap/i,
        /dirb/i,
        /gobuster/i,
        /burpsuite/i,
        /owasp.*zap/i,
        /w3af/i,
    ]

    if (
        maliciousBots.some((pattern) => pattern.test(userAgent))
    ) {
        return true
    }

    return false
}