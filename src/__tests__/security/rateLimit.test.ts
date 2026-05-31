import { describe, it, expect, beforeEach, vi } from "vitest"

vi.stubEnv("REDIS_URL", "")

const { isRateLimited } = await import("@/_lib/security/rateLimit")

describe("isRateLimited (in-memory fallback)", () => {
    const ip = `test-ip-${Date.now()}`

    it("allows requests within the limit", async () => {
        const result = await isRateLimited(ip + "-allow", ip, "auth")
        expect(result.limited).toBe(false)
        expect(result.remaining).toBeGreaterThanOrEqual(0)
    })

    it("blocks after exceeding auth limit (15 requests)", async () => {
        const testIp = `block-test-${Date.now()}`
        let lastResult = { limited: false, remaining: 0, resetAt: 0 }

        for (let i = 0; i < 20; i++) {
            lastResult = await isRateLimited(testIp, testIp, "auth")
        }

        expect(lastResult.limited).toBe(true)
        expect(lastResult.remaining).toBe(0)
    })

    it("returns a future resetAt timestamp", async () => {
        const result = await isRateLimited(ip + "-reset", ip, "general")
        expect(result.resetAt).toBeGreaterThan(Date.now())
    })
})