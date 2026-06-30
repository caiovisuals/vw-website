import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/_lib/prisma"
import { verifyPassword } from "@/_lib/utils/auth"
import { loginSchema } from "@/_lib/validations/auth"

const DUMMY_HASH = "$2b$12$dummyhashfortimingattackprevention"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "E-mail", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials)
                if (!parsed.success) return null

                const { email, password } = parsed.data

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        passwordHash: true,
                        avatarUrl: true,
                    },
                })

                if (!user || !user.passwordHash) {
                    await verifyPassword(password, DUMMY_HASH)
                    return null
                }

                const valid = await verifyPassword(password, user.passwordHash)
                if (!valid) return null

                await prisma.user
                    .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
                    .catch(() => null)

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        }
    },
}