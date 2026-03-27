type RateLimitType = "auth" | "api" | "general"

interface SuspiciousIPData {
    blockedUntil: number
    violations: number
    lastViolation: number
}

const CONFIG = {
    RATE_LIMIT_WINDOW: 15 * 60, // 15 minutos
    MAX_REQUESTS: {
        auth: 15,
        api: 50,
        general: 100,
    },
    BLOCK_DURATION: 60 * 60, // 1 hora de bloqueio para IPs suspeitos
    MAX_VIOLATIONS: 3, // Máximo de violações antes de bloqueio prolongado
    VIOLATION_RESET_TIME: 24 * 60 * 60 * 1000,
}

const suspiciousIPs = new Map<string, SuspiciousIPData>()

type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

export function isRateLimited(ip: string, key: string, type: RateLimitType): {
    limited: boolean
    remaining: number
    resetAt: number
} {
    const now = Date.now()

    const suspicious = suspiciousIPs.get(ip)
    if (suspicious) {
        if (now < suspicious.blockedUntil) {
            return { limited: true, remaining: 0, resetAt: suspicious.blockedUntil }
        } else {
            suspiciousIPs.delete(ip)
        }
    }

    const maxRequests = CONFIG.MAX_REQUESTS[type]
    const windowMs = CONFIG.RATE_LIMIT_WINDOW * 1000

    const storeKey = `${type}:${key}`

    const entry = store.get(storeKey)
 
    if (!entry || entry.resetAt <= now) {
        store.set(storeKey, { count: 1, resetAt: now + windowMs })
        return { limited: false, remaining: maxRequests - 1, resetAt: now + windowMs }
    }
 
    entry.count++
 
    if (entry.count > maxRequests) {
        return { limited: true, remaining: 0, resetAt: entry.resetAt }
    }
 
    return { limited: false, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt <= now) store.delete(key)
    }
}, 5 * 60 * 1000)