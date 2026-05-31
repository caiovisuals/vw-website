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
            <h2 className="text-3xl font-bold mb-3">Ops, algo falhou</h2>
            <p className="text-gray-500 mb-6">Não foi possível carregar este conteúdo.</p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="px-5 py-2.5 bg-[var(--vw-blue)] text-white hover:opacity-90 rounded-xl font-semibold transition"
                >
                    Tentar novamente
                </button>
                <Link href="/" className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl font-semibold transition">
                    Início
                </Link>
            </div>
        </div>
    )
}