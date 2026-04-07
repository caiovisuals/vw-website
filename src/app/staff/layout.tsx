"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/_lib/contexts/AuthContext"
import StaffSidebar from "@/_components/staff/StaffSidebar"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && (!user || (user.role !== "STAFF" && user.role !== "ADMIN"))) {
            router.replace("/")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-2 border-[var(--dark-blue)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[var(--black-text-hover)]">Verificando acesso...</span>
                </div>
            </div>
        )
    }

    if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
        return null
    }

    return (
        <div className="flex min-h-screen">
            <StaffSidebar />
            <main className="flex-1 ml-56 min-h-screen overflow-auto">
                {children}
            </main>
        </div>
    )
}