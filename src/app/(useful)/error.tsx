"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function UsefulError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("[UsefulError]", error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="flex flex-col items-center justify-center mb-3">
                <h2 className="text-3xl font-bold">Ops, algo falhou</h2>
                <p className="text-gray-500">Não foi possível carregar este conteúdo.</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
                <button
                    onClick={reset}
                    className="px-6 py-2 text-[var(--white-text)] bg-[var(--dark-blue)] hover:opacity-90 rounded-xl font-semibold transition"
                >
                    Tentar novamente
                </button>
                <Link href="/" className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-50 rounded-xl font-semibold transition">
                    Início
                </Link>
            </div>
        </div>
    )
}