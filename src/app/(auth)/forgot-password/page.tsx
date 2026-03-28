"use client"

import Link from "next/link"
import { useState } from "react"

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="min-h-[75vh] max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-124px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#202020] to-[var(--dark-blue)] px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <form className="w-full max-w-md bg-[var(--white-background)] rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold vw-font mb-1">
                        Esqueci minha Senha
                    </h1>
                    <h2 className="text-lg vw-font leading-none">
                        Troque a sua senha confirmando sua entrada pelo seu email
                    </h2>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 cursor-pointer"
                    >
                        Enviar Código
                    </button>
                </div>
                <div className="mt-3">
                    <p className="text-sm">Lembrou sua senha?{" "}
                        <Link href="/login" className="font-semibold">Entre na sua Conta</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}