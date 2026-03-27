import { z } from "zod"

export const carFiltersSchema = z.object({
    fuel: z.array(z.enum(["FLEX", "ELECTRIC", "HYBRID", "GASOLINE", "DIESEL"])).optional(),
    transmission: z.array(z.enum(["MANUAL", "AUTOMATIC", "CVT"])).optional(),
    featured: z.coerce.boolean().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
})

export const saveConfigSchema = z.object({
    carId: z.string().cuid(),
    colorId: z.string().cuid().optional(),
    wheelId: z.string().cuid().optional(),
    seatId: z.string().cuid().optional(),
    techIds: z.array(z.string().cuid()).default([]),
})

export const leadSchema = z.object({
    carId: z.string().cuid().optional(),
    dealerId: z.string().cuid().optional(),
    name: z.string().min(2).max(80).trim(),
    email: z.string().email().toLowerCase().trim(),
    phone: z.string().regex(/^\+?[\d\s\-()]{8,20}$/).optional().or(z.literal("")),
    message: z.string().max(1000).optional(),
})

export const createCarSchema = z.object({
    slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "Slug deve ser em lowercase com hífens."),
    name: z.string().min(1).max(80),
    tagline: z.string().max(150).optional(),
    description: z.string().max(2000).optional(),
    basePrice: z.number().positive(),
    fuel: z.enum(["FLEX", "ELECTRIC", "HYBRID", "GASOLINE", "DIESEL"]),
    transmission: z.enum(["MANUAL", "AUTOMATIC", "CVT"]),
    isElectric: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    year: z.number().int().min(2000).max(2030),
    imageUrl: z.string().url().optional(),
    interiorImageUrl: z.string().url().optional(),
})

export const updateCarSchema = createCarSchema.partial()

export type CarFilters = z.infer<typeof carFiltersSchema>
export type SaveConfigInput = z.infer<typeof saveConfigSchema>
export type LeadInput = z.infer<typeof leadSchema>
export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>