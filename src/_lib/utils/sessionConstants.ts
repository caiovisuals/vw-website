export type Role = "USER" | "STAFF" | "ADMIN"

export const SESSION_COOKIE = "vw_session"

export const ROLE_HIERARCHY: Role[] = ["USER", "STAFF", "ADMIN"]

export const ROLE_LEVEL: Record<string, number> = {
    USER: 0,
    STAFF: 1,
    ADMIN: 2,
}