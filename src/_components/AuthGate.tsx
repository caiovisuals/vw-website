"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useAuth, type AuthUser } from "@/_lib/contexts/AuthContext"

/**
 * Envolve as páginas da área logada: exibe um esqueleto enquanto a sessão é
 * verificada e o convite para entrar quando não há usuário autenticado.
 */
export default function AuthGate({ children }: { children: (user: AuthUser) => ReactNode }) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
                <div className="h-10 w-72 max-w-full rounded-xl bg-[var(--white-text-hover)]/40 animate-pulse" />
                <div className="h-6 w-96 max-w-full rounded-xl bg-[var(--white-text-hover)]/40 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-40 rounded-3xl bg-[var(--white-text-hover)]/40 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-semibold vw-font text-center">Sentimos muito.</h1>
                    <p className="text-xl vw-font text-center">Para acessar essa página você precisa estar logado.</p>
                </div>
                <div className="flex flex-row gap-4">
                    <Link href="/login" className="flex items-center justify-center whitespace-nowrap px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">Faça Login</Link>
                    <Link href="/register" className="flex items-center justify-center whitespace-nowrap px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">Crie sua Conta</Link>
                </div>
            </div>
        )
    }

    return <>{children(user)}</>
}