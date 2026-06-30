export type RateLimitType = "auth" | "api" | "general"

export interface RateLimitResult {
    limited: boolean
    remaining: number
    resetAt: number
    limit: number
}

const CONFIG = {
    WINDOW_MS: 15 * 60 * 1000, // janela de 15 minutos
    MAX_REQUESTS: {
        auth: 15,
        api: 50,
        general: 100,
    } as Record<RateLimitType, number>,
    BLOCK_DURATION_MS: 60 * 60 * 1000, // 1 hora de bloqueio para IPs reincidentes
    MAX_VIOLATIONS: 3, // violações até o bloqueio prolongado
    VIOLATION_RESET_MS: 24 * 60 * 60 * 1000, // janela de contagem de violações
    MAX_ENTRIES: 10_000, // teto de memória para evitar crescimento ilimitado
}

interface Entry {
    count: number
    resetAt: number
}

interface SuspiciousData {
    blockedUntil: number
    violations: number
    lastViolation: number
}

const store = new Map<string, Entry>()
const suspiciousIPs = new Map<string, SuspiciousData>()

let lastSweep = 0

/**
 * Limpeza preguiçosa: roda no máximo uma vez por minuto, durante uma chamada
 * normal. Evita `setInterval` no escopo do módulo (que não é confiável no Edge
 * Runtime e vaza em ambientes serverless).
 */
function sweep(now: number): void {
    if (now - lastSweep < 60_000) return
    lastSweep = now

    for (const [key, entry] of store) {
        if (entry.resetAt <= now) store.delete(key)
    }
    for (const [ip, data] of suspiciousIPs) {
        if (data.blockedUntil <= now && now - data.lastViolation > CONFIG.VIOLATION_RESET_MS) {
            suspiciousIPs.delete(ip)
        }
    }
}

/** Registra uma violação e, ao atingir o limite, aplica bloqueio prolongado. */
function registerViolation(ip: string, now: number): void {
    const data = suspiciousIPs.get(ip)

    if (!data || now - data.lastViolation > CONFIG.VIOLATION_RESET_MS) {
        suspiciousIPs.set(ip, { blockedUntil: 0, violations: 1, lastViolation: now })
        return
    }

    data.violations += 1
    data.lastViolation = now

    if (data.violations >= CONFIG.MAX_VIOLATIONS) {
        data.blockedUntil = now + CONFIG.BLOCK_DURATION_MS
    }
}

export async function isRateLimited(ip: string, key: string, type: RateLimitType): Promise<RateLimitResult> {
    const now = Date.now()
    sweep(now)

    const limit = CONFIG.MAX_REQUESTS[type]

    // IP em bloqueio prolongado por reincidência.
    const suspicious = suspiciousIPs.get(ip)
    if (suspicious && now < suspicious.blockedUntil) {
        return { limited: true, remaining: 0, resetAt: suspicious.blockedUntil, limit }
    }

    const storeKey = `${type}:${key}`
    const entry = store.get(storeKey)

    if (!entry || entry.resetAt <= now) {
        // Protege a memória contra crescimento ilimitado sob ataque.
        if (store.size >= CONFIG.MAX_ENTRIES) sweep(now + 60_001)
        const resetAt = now + CONFIG.WINDOW_MS
        store.set(storeKey, { count: 1, resetAt })
        return { limited: false, remaining: limit - 1, resetAt, limit }
    }

    entry.count += 1

    if (entry.count > limit) {
        registerViolation(ip, now)
        return { limited: true, remaining: 0, resetAt: entry.resetAt, limit }
    }

    return { limited: false, remaining: limit - entry.count, resetAt: entry.resetAt, limit }
}

/** Headers padrão `X-RateLimit-*` (+ `Retry-After` quando bloqueado). */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
    const headers: Record<string, string> = {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    }
    if (result.limited) {
        headers["Retry-After"] = String(Math.max(0, Math.ceil((result.resetAt - Date.now()) / 1000)))
    }
    return headers
}

/** Utilitário para testes: limpa todo o estado em memória. */
export function __resetRateLimitStore(): void {
    store.clear()
    suspiciousIPs.clear()
    lastSweep = 0
}