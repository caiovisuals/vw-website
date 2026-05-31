"use client"

import { useEffect } from "react"

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("[AuthError]", error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Erro de autenticação</h2>
            <p className="text-gray-500 mb-6">Tente novamente ou atualize a página.</p>
            <button
                onClick={reset}
                className="px-5 py-2.5 bg-[var(--vw-blue)] text-white hover:opacity-90 rounded-xl font-semibold transition"
            >
                Tentar novamente
            </button>
        </div>
    )
}