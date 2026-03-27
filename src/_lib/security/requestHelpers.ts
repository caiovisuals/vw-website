import { NextRequest } from "next/server"

function clean(value: string | null, fallback = "unknown") {
    return value?.replace(/[\r\n]/g, "").trim() || fallback
}

function getHeader(req: NextRequest, key: string): string | null {
    return req.headers.get(key)
}

async function createFingerprint(req: NextRequest, ip: string, userAgent: string) {
    const platform = clean(getHeader(req, "sec-ch-ua-platform"))
    const mobile = clean(getHeader(req, "sec-ch-ua-mobile"))
    const encoding = clean(getHeader(req, "accept-encoding"))
    const language = clean(getHeader(req, "accept-language"))
    const ua = clean(getHeader(req, "sec-ch-ua"))
    const arch = clean(getHeader(req, "sec-ch-ua-arch"))

    const raw = [
        ip,
        userAgent,
        platform,
        mobile,
        encoding,
        language,
        ua,
        arch
    ].join("|")
    const encoder = new TextEncoder()
    const data = encoder.encode(raw)

    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
}

export async function getRequestMeta(req: NextRequest) {
    const forwarded = req.headers.get("x-forwarded-for")
    const cfIP = req.headers.get("cf-connecting-ip")
    const realIP = req.headers.get("x-real-ip")

    const ip = forwarded?.split(",")[0].trim() ?? cfIP ?? realIP ?? "unknown"
    const userAgent = clean(req.headers.get("user-agent") ?? "unknown")
    const requestId = clean(req.headers.get("x-request-id") ?? crypto.randomUUID())
    const referer = clean(req.headers.get("referer") ?? "unknown")

    const fingerprint = createFingerprint(req, ip, userAgent)
    
    return {
        ip,
        requestId,
        userAgent,
        referer,
        fingerprint
    }
}