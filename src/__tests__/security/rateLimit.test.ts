import { describe, it, expect, beforeEach } from "vitest"
import { isRateLimited, rateLimitHeaders, __resetRateLimitStore } from "@/_lib/security/rateLimit"

beforeEach(() => {
    __resetRateLimitStore()
})

describe("isRateLimited (in-memory)", () => {
    it("allows requests within the limit", async () => {
        const result = await isRateLimited("1.1.1.1", "1.1.1.1", "auth")
        expect(result.limited).toBe(false)
        expect(result.limit).toBe(15)
        expect(result.remaining).toBe(14)
    })

    it("blocks after exceeding the auth limit (15 requests)", async () => {
        let last = await isRateLimited("2.2.2.2", "2.2.2.2", "auth")
        for (let i = 0; i < 20; i++) {
            last = await isRateLimited("2.2.2.2", "2.2.2.2", "auth")
        }
        expect(last.limited).toBe(true)
        expect(last.remaining).toBe(0)
    })

    it("tracks separate buckets per type and key", async () => {
        const api = await isRateLimited("3.3.3.3", "3.3.3.3", "api")
        const general = await isRateLimited("3.3.3.3", "3.3.3.3", "general")
        expect(api.limit).toBe(50)
        expect(general.limit).toBe(100)
    })

    it("returns a future resetAt timestamp", async () => {
        const result = await isRateLimited("4.4.4.4", "4.4.4.4", "general")
        expect(result.resetAt).toBeGreaterThan(Date.now())
    })
})

describe("escalating block for repeat offenders", () => {
    it("blocks the IP across buckets after repeated violations", async () => {
        const ip = "5.5.5.5"

        for (let i = 0; i < 20; i++) {
            isRateLimited(ip, ip, "auth")
        }

        const blocked = await isRateLimited(ip, "outra-key", "general")
        expect(blocked.limited).toBe(true)
    })

    it("does not block a well-behaved IP", async () => {
        const ip = "8.8.8.8"
        for (let i = 0; i < 10; i++) await isRateLimited(ip, ip, "auth")
        const result = await isRateLimited(ip, "outra-key", "general")
        expect(result.limited).toBe(false)
    })
})

describe("rateLimitHeaders", () => {
    it("emits X-RateLimit-* headers", async () => {
        const result = await isRateLimited("6.6.6.6", "6.6.6.6", "api")
        const headers = rateLimitHeaders(result)
        expect(headers["X-RateLimit-Limit"]).toBe("50")
        expect(headers["X-RateLimit-Remaining"]).toBe("49")
        expect(Number(headers["X-RateLimit-Reset"])).toBeGreaterThan(0)
        expect(headers["Retry-After"]).toBeUndefined()
    })

    it("includes Retry-After when limited", async () => {
        const ip = "7.7.7.7"
        let result = await isRateLimited(ip, ip, "auth")
        for (let i = 0; i < 20; i++) result = await isRateLimited(ip, ip, "auth")
        const headers = rateLimitHeaders(result)
        expect(headers["Retry-After"]).toBeDefined()
        expect(Number(headers["Retry-After"])).toBeGreaterThanOrEqual(0)
    })
})