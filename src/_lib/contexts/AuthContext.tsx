"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { getCSRFToken, invalidateCSRFCache } from "@/_hooks/useCSRF"

export type Role = "USER" | "STAFF" | "ADMIN"

export type AuthUser = {
    id: string
    name: string
    email: string
    role: Role
    avatarUrl: string | null
}

interface AuthContextValue {
    user: AuthUser | null
    isLoading: boolean
    refetch: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const refetch = useCallback(async () => {
        try {
            const res = await fetch("/api/me", { credentials: "include" })
            if (res.ok) {
                const json = await res.json()
                setUser(json.data ?? null)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        refetch()
    }, [refetch])

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" })

            const csrf = await getCSRFToken()
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "x-csrf-token": csrf },
                credentials: "include",
            })
        } finally {
            invalidateCSRFCache()
            setUser(null)
            router.push("/")
            router.refresh()
        }
    }, [router])

    return (
        <AuthContext.Provider value={{ user, isLoading, refetch, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}