import { describe, it, expect } from "vitest"
import { createOfferSchema, updateOfferSchema, offerQuerySchema } from "@/_lib/validations/offers"

const valid = {
    name: "Polo",
    title: "Polo TSI a partir de R$ 96.990",
    category: "hatch",
    model: "polo",
    type: "novo",
    price: 96990,
    imageUrl: "/assets/cars/polo/offer.webp",
}

describe("createOfferSchema", () => {
    it("aceita uma oferta válida e normaliza opcionais para null", () => {
        const data = createOfferSchema.parse({ ...valid, subtitle: "", badge: "", discount: 0, validUntil: "" })
        expect(data.subtitle).toBeNull()
        expect(data.badge).toBeNull()
        expect(data.discount).toBeNull()
        expect(data.validUntil).toBeNull()
        expect(data.active).toBe(true)
    })

    it("converte validUntil em Date", () => {
        const data = createOfferSchema.parse({ ...valid, validUntil: "2026-12-31" })
        expect(data.validUntil).toBeInstanceOf(Date)
    })

    it("aceita preço vindo como string numérica", () => {
        expect(createOfferSchema.parse({ ...valid, price: "1000" }).price).toBe(1000)
    })

    it("rejeita categoria e tipo desconhecidos", () => {
        expect(createOfferSchema.safeParse({ ...valid, category: "van" }).success).toBe(false)
        expect(createOfferSchema.safeParse({ ...valid, type: "usado" }).success).toBe(false)
    })

    it("rejeita preço zero ou negativo", () => {
        expect(createOfferSchema.safeParse({ ...valid, price: 0 }).success).toBe(false)
        expect(createOfferSchema.safeParse({ ...valid, price: -1 }).success).toBe(false)
    })

    it("aceita apenas imagens locais", () => {
        expect(createOfferSchema.safeParse({ ...valid, imageUrl: "https://evil.com/x.png" }).success).toBe(false)
        expect(createOfferSchema.safeParse({ ...valid, imageUrl: "javascript:alert(1)" }).success).toBe(false)
    })

    it("ignora campos fora do schema (mass assignment)", () => {
        const data = createOfferSchema.parse({ ...valid, id: "hack", createdAt: "2000-01-01" })
        expect(data).not.toHaveProperty("id")
        expect(data).not.toHaveProperty("createdAt")
    })
})

describe("updateOfferSchema", () => {
    it("permite atualização parcial", () => {
        expect(updateOfferSchema.parse({ active: false })).toEqual({ active: false })
    })
})

describe("offerQuerySchema", () => {
    it("normaliza o modelo para lowercase", () => {
        expect(offerQuerySchema.parse({ model: "Polo" }).model).toBe("polo")
    })

    it("rejeita categoria inválida", () => {
        expect(offerQuerySchema.safeParse({ category: "x" }).success).toBe(false)
    })
})

describe("updateOfferSchema — limpeza explícita", () => {
    it("permite remover badge/desconto enviando vazio", () => {
        expect(updateOfferSchema.parse({ badge: "", discount: null })).toEqual({ badge: null, discount: null })
    })
})