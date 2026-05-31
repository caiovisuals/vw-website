import { describe, it, expect, vi } from "vitest"

// Mock env to avoid t3-oss validation during tests
vi.mock("@/_lib/env", () => ({
    env: {
        NODE_ENV: "test",
        DATABASE_URL: "postgresql://test:test@localhost:5432/test",
        NEXTAUTH_SECRET: "test-secret-32-characters-long!!",
        NEXTAUTH_URL: "http://localhost:3000",
    },
}))

const { validatePasswordStrength, generateSecureToken, getSessionExpiry, getResetTokenExpiry } =
    await import("@/_lib/utils/auth")

describe("validatePasswordStrength", () => {
    it("rejects passwords shorter than 8 chars", () => {
        const result = validatePasswordStrength("Ab1")
        expect(result.valid).toBe(false)
        expect(result.message).toMatch(/8 caracteres/)
    })

    it("rejects passwords without uppercase", () => {
        const result = validatePasswordStrength("abcdef123")
        expect(result.valid).toBe(false)
        expect(result.message).toMatch(/maiúscula/)
    })

    it("rejects passwords without numbers", () => {
        const result = validatePasswordStrength("Abcdefghij")
        expect(result.valid).toBe(false)
        expect(result.message).toMatch(/número/)
    })

    it("accepts valid passwords", () => {
        expect(validatePasswordStrength("Secure123").valid).toBe(true)
        expect(validatePasswordStrength("MyPass99!").valid).toBe(true)
    })
})

describe("generateSecureToken", () => {
    it("returns a hex string of the correct length", () => {
        const token = generateSecureToken(32)
        expect(token).toHaveLength(64)
        expect(token).toMatch(/^[0-9a-f]+$/)
    })

    it("generates unique tokens", () => {
        const tokens = new Set(Array.from({ length: 100 }, () => generateSecureToken()))
        expect(tokens.size).toBe(100)
    })
})

describe("getSessionExpiry", () => {
    it("returns a date ~30 days in the future", () => {
        const expiry = getSessionExpiry()
        const diffDays = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        expect(diffDays).toBeGreaterThan(29)
        expect(diffDays).toBeLessThan(31)
    })
})

describe("getResetTokenExpiry", () => {
    it("returns a date ~2 hours in the future", () => {
        const expiry = getResetTokenExpiry()
        const diffHours = (expiry.getTime() - Date.now()) / (1000 * 60 * 60)
        expect(diffHours).toBeGreaterThan(1.9)
        expect(diffHours).toBeLessThan(2.1)
    })
})