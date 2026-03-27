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

export async function isRateLimited(
    ip: string,
    type: RateLimitType,
    fingerprint?: string
) {
    try {

    } catch (error) {
        console.error('Erro ao acessar Redis', error)
    }
}