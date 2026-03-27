import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        NEXTAUTH_SECRET: z.string().min(32),
        NEXTAUTH_URL: z.string().url(),
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    },
    client: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
})