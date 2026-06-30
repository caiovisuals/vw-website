import { describe, it, expect } from "vitest"
import {
    carFiltersSchema,
    createCarSchema,
    leadSchema,
    saveConfigSchema,
} from "@/_lib/validations/cars"

const CUID = "clv1a2b3c4d5e6f7g8h9i0j1"

describe("carFiltersSchema", () => {
    it("applies defaults for page and limit", () => {
        const result = carFiltersSchema.parse({})
        expect(result.page).toBe(1)
        expect(result.limit).toBe(20)
    })

    it("coerces numeric strings", () => {
        const result = carFiltersSchema.parse({ page: "3", limit: "10", minPrice: "50000" })
        expect(result.page).toBe(3)
        expect(result.limit).toBe(10)
        expect(result.minPrice).toBe(50000)
    })

    it("rejects an unknown fuel value", () => {
        expect(() => carFiltersSchema.parse({ fuel: ["PLASMA"] })).toThrow()
    })

    it("caps limit at 50", () => {
        expect(() => carFiltersSchema.parse({ limit: "99" })).toThrow()
    })
})

describe("createCarSchema", () => {
    const base = {
        slug: "novo-jetta",
        name: "Jetta",
        basePrice: 280000,
        fuel: "FLEX",
        transmission: "AUTOMATIC",
        year: 2026,
    }

    it("accepts a valid car and applies boolean defaults", () => {
        const result = createCarSchema.parse(base)
        expect(result.isElectric).toBe(false)
        expect(result.isFeatured).toBe(false)
    })

    it("rejects slugs with uppercase or spaces", () => {
        expect(() => createCarSchema.parse({ ...base, slug: "Novo Jetta" })).toThrow()
        expect(() => createCarSchema.parse({ ...base, slug: "NovoJetta" })).toThrow()
    })

    it("rejects a non-positive base price", () => {
        expect(() => createCarSchema.parse({ ...base, basePrice: -1 })).toThrow()
    })

    it("rejects a year outside the allowed range", () => {
        expect(() => createCarSchema.parse({ ...base, year: 1990 })).toThrow()
        expect(() => createCarSchema.parse({ ...base, year: 2031 })).toThrow()
    })
})

describe("leadSchema", () => {
    it("normalizes email to lowercase and trims name", () => {
        const result = leadSchema.parse({ name: "  Caio  ", email: "TEST@MAIL.COM" })
        expect(result.email).toBe("test@mail.com")
        expect(result.name).toBe("Caio")
    })

    it("accepts an empty phone string", () => {
        const result = leadSchema.parse({ name: "Caio", email: "a@b.com", phone: "" })
        expect(result.phone).toBe("")
    })

    it("rejects a name shorter than 2 chars", () => {
        expect(() => leadSchema.parse({ name: "C", email: "a@b.com" })).toThrow()
    })
})

describe("saveConfigSchema", () => {
    it("defaults techIds to an empty array", () => {
        const result = saveConfigSchema.parse({ carId: CUID })
        expect(result.techIds).toEqual([])
    })

    it("rejects a non-cuid carId", () => {
        expect(() => saveConfigSchema.parse({ carId: "not-a-cuid" })).toThrow()
    })
})