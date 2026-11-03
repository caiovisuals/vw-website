import { z } from "zod"

export const OFFER_CATEGORIES = ["hatch", "suv", "sedan", "picape"] as const
export const OFFER_TYPES = ["novo", "seminovo"] as const

// Campos opcionais: "" e null viram null, mas undefined continua undefined para
// que um PATCH parcial não apague valores que não foram enviados.
const keepUndefined = <T, R>(fn: (v: T) => R) => (v: T | undefined) => (v === undefined ? undefined : fn(v))

const optionalText = (max: number) =>
    z.string().trim().max(max).optional().nullable().transform(keepUndefined(v => v || null))

export const offerQuerySchema = z.object({
    category: z.enum(OFFER_CATEGORIES).optional(),
    model:    z.string().trim().toLowerCase().max(80).optional(),
    type:     z.enum(OFFER_TYPES).optional(),
})

export const createOfferSchema = z.object({
    name:       z.string().trim().min(1).max(80),
    title:      z.string().trim().min(3).max(150),
    subtitle:   optionalText(150),
    category:   z.enum(OFFER_CATEGORIES),
    model:      z.string().trim().toLowerCase().min(1).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase com hífens."),
    type:       z.enum(OFFER_TYPES),
    price:      z.coerce.number().positive().max(100_000_000),
    discount:   z.coerce.number().nonnegative().max(100_000_000).optional().nullable()
                    .transform(keepUndefined(v => (v ? v : null))),
    imageUrl:   z.string().trim().min(1).max(500)
                    .regex(/^\/[\w\-./]+$/, "Use um caminho local, ex: /assets/cars/polo/offer.webp"),
    active:     z.boolean().default(true),
    validUntil: z.union([z.literal(""), z.null(), z.coerce.date()]).optional()
                    .transform(keepUndefined(v => (v instanceof Date ? v : null))),
    badge:      optionalText(40),
})

// .partial() mantém o default(true) de `active`; sem o override, qualquer PATCH
// reativaria a oferta.
export const updateOfferSchema = createOfferSchema.partial().extend({
    active: z.boolean().optional(),
})

export type CreateOfferInput = z.infer<typeof createOfferSchema>