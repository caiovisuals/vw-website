import bcrypt from "bcryptjs"
import crypto from "crypto"
import { env } from "./../env"

const SALT_ROUNDS = 12
const RESET_TOKEN_EXPIRY_HOURS = 2
const EMAIL_TOKEN_EXPIRY_HOURS = 24
const SESSION_EXPIRY_DAYS = 30

export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
}

export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: "A senha deve ter pelo menos 8 caracteres." }
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "A senha deve ter pelo menos uma letra maiúscula." }
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "A senha deve ter pelo menos um número." }
    }
    return { valid: true }
}

export function generateSecureToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex")
}

export function generateShortCode(bytes = 4): string {
    return crypto.randomBytes(bytes).toString("hex").toUpperCase()
}

export function getResetTokenExpiry(): Date {
    const d = new Date()
    d.setHours(d.getHours() + RESET_TOKEN_EXPIRY_HOURS)
    return d
}

export function getEmailTokenExpiry(): Date {
    const d = new Date()
    d.setHours(d.getHours() + EMAIL_TOKEN_EXPIRY_HOURS)
    return d
}

export function getSessionExpiry(): Date {
    const d = new Date()
    d.setDate(d.getDate() + SESSION_EXPIRY_DAYS)
    return d
}

export function buildSessionCookieOptions() {
    return {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
        path: "/",
    }
}