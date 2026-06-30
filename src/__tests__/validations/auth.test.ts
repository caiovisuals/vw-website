import { describe, it, expect } from "vitest"
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "@/_lib/validations/auth"

describe("registerSchema", () => {
    const base = { name: "Caio", email: "caio@mail.com", password: "Secure123" }

    it("accepts valid input and lowercases the email", () => {
        const result = registerSchema.parse({ ...base, email: "CAIO@MAIL.COM" })
        expect(result.email).toBe("caio@mail.com")
    })

    it("rejects a password without an uppercase letter", () => {
        expect(() => registerSchema.parse({ ...base, password: "secure123" })).toThrow()
    })

    it("rejects a password without a number", () => {
        expect(() => registerSchema.parse({ ...base, password: "SecurePass" })).toThrow()
    })

    it("rejects a password shorter than 8 chars", () => {
        expect(() => registerSchema.parse({ ...base, password: "Sec1" })).toThrow()
    })
})

describe("loginSchema", () => {
    it("requires a non-empty password", () => {
        expect(() => loginSchema.parse({ email: "a@b.com", password: "" })).toThrow()
    })

    it("rejects an invalid email", () => {
        expect(() => loginSchema.parse({ email: "nope", password: "x" })).toThrow()
    })
})

describe("forgotPasswordSchema", () => {
    it("lowercases the email", () => {
        expect(forgotPasswordSchema.parse({ email: "A@B.COM" }).email).toBe("a@b.com")
    })
})

describe("resetPasswordSchema", () => {
    const valid = { token: "tok", password: "Secure123", confirmPassword: "Secure123" }

    it("accepts matching passwords", () => {
        expect(resetPasswordSchema.parse(valid).password).toBe("Secure123")
    })

    it("rejects mismatched passwords", () => {
        expect(() =>
            resetPasswordSchema.parse({ ...valid, confirmPassword: "Different9" })
        ).toThrow()
    })
})