import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(16).url(),
        NEXTAUTH_SECRET: z.string().min(32),
        NEXTAUTH_URL: z.string().min(8).url(),
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        REDIS_URL: z.string().url().optional(),
        RESEND_API_KEY: z.string().optional(),
        EMAIL_FROM: z.string().email().optional(),
        SENTRY_DSN: z.string().url().optional(),
        SENTRY_ORG: z.string().optional(),
        SENTRY_PROJECT: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(16),
        NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        REDIS_URL: process.env.REDIS_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ORG: process.env.SENTRY_ORG,
        SENTRY_PROJECT: process.env.SENTRY_PROJECT,
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
})