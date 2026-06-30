"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ShowPassword from "@/_components/ui/ShowPassword"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token") ?? ""

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    if (!token) {
        return (
            <p role="alert" className="text-sm">
                Link inválido. Solicite uma nova recuperação de senha.
            </p>
        )
    }

    return (
        <form className="flex flex-col gap-4">
            <div className="relative">
                <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nova senha"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                />
                <ShowPassword show={showPassword} setShow={setShowPassword} />
            </div>
            <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirme a nova senha"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
            />
            <button
                type="submit"
                disabled={isLoading || done}
                className="w-full py-3 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 cursor-pointer disabled:opacity-60"
            >
                {isLoading ? "Salvando" : "Redefinir senha"}
            </button>
        </form>
    )
}

export default function ResetPassword() {
    return (
        <div className="min-h-[75vh] max-h-[calc(110vh-100px)] md:max-h-[calc(100vh-124px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#202020] to-[var(--dark-blue)] px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <div className="w-full max-w-md bg-[var(--white-background)] rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold vw-font mb-1">Nova senha</h1>
                    <h2 className="text-lg vw-font leading-none">Defina uma nova senha para sua conta.</h2>
                </div>
                <Suspense 
                    fallback={
                        <p className="text-sm">Carregando</p>
                    }
                >
                    <ResetPasswordForm />
                </Suspense>
                <div className="mt-3">
                    <p className="text-sm">
                        Lembrou sua senha?{" "}
                        <Link href="/login" className="font-semibold">Entrar</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}