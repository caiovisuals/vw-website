import { cookies } from "next/headers"
import { prisma } from "@/_lib/prisma"

export type Role = "USER" | "STAFF" | "ADMIN"

export type SessionUser = {
    id: string
    name: string
    email: string
    role: Role
    avatarUrl: string | null
}

export const SESSION_COOKIE = "vw_session"

export async function getCurrentUser(): Promise<SessionUser | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!token) return null

    const session = await prisma.session.findUnique({
        where: { token },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatarUrl: true,
                },
            },
        },
    })

    if (!session || session.expiresAt < new Date()) {
        if (session) {
            await prisma.session.delete({ where: { token } }).catch(() => null)
        }
        return null
    }

    return session.user
}

export async function requireAuth(): Promise<SessionUser> {
    const user = await getCurrentUser()
    if (!user) {
        throw new AuthError("Unauthorized", 401)
    }
    return user
}

export async function requireRole(role: Role): Promise<SessionUser> {
    const user = await requireAuth()

    const hierarchy: Role[] = ["USER", "STAFF", "ADMIN"]
    const userLevel = hierarchy.indexOf(user.role)
    const requiredLevel = hierarchy.indexOf(role)

    if (userLevel < requiredLevel) {
        throw new AuthError("Forbidden", 403)
    }

    return user
}

export class AuthError extends Error {
    constructor(
        message: string,
        public statusCode: 401 | 403 = 401
    ) {
        super(message)
        this.name = "AuthError"
    }
}