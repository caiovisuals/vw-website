import "next-auth"
import "next-auth/jwt"

type Role = "USER" | "STAFF" | "ADMIN"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            role: Role
            avatarUrl: string | null
        }
    }

    interface User {
        id: string
        name: string
        email: string
        role: Role
        avatarUrl: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: Role
        avatarUrl: string | null
    }
}