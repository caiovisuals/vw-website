"use client"

import Link from "next/link"
import { useAuth } from "@/_lib/contexts/AuthContext"

export default function Home() {
    const { user, isLoading } = useAuth()

    if (!user) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-semibold vw-font text-center">Sentimos muito.</h1>
                    <p className="text-xl vw-font text-center">Para acessar essa página você precisa está logado.</p>
                </div>
                <div className="flex flex-row gap-4">
                    <Link href="/login" className="w-[50%] flex items-center justify-center whitespace-nowrap px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">Faça Login</Link>
                    <Link href="/register" className="w-[50%] flex items-center justify-center whitespace-nowrap px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">Crie sua Conta</Link>
                </div>
            </div>
        )
    }

    return(
        <div className="flex flex-col px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="flex flex-col">
                <h1 className="text-3xl font-semibold vw-font">Boa tarde, {user.name}!</h1>
                <h3 className="text-xl vw-font">Confira as novidades enquanto você esteve fora.</h3>
            </div>
            <section></section>
        </div>
    )
}