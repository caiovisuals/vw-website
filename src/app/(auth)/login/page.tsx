"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/_lib/contexts/AuthContext"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import ShowPassword from "@/_components/ui/ShowPassword"

type FieldErrors = Partial<Record<"email" | "password", string>>

export default function Login() {
    const { refetch } = useAuth()
    const router = useRouter()
    const { t } = useLanguage()
    const searchParams = useSearchParams()
    const justRegistered = searchParams.get("registered") === "1"

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [globalError, setGlobalError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setGlobalError(null)
        setFieldErrors({})
        setIsLoading(true)
 
        const form = e.currentTarget
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim()
        const password = (form.elements.namedItem("password") as HTMLInputElement).value

        if (!email.includes("@")) {
            setFieldErrors({ email: "Email inválido." })
            return
        }
 
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            })
 
            const json = await res.json()
 
            if (!res.ok) {
                if (json.fields) {
                    setFieldErrors(json.fields as FieldErrors)
                } else {
                    setGlobalError(json.error ?? "Erro ao fazer login.")
                }
                return
            }
 
            await refetch()
            router.push("/home")
            router.refresh()
        } catch {
            setGlobalError("Erro de conexão. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[75vh] max-h-[calc(110vh-100px)] md:max-h-[calc(100vh-124px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#202020] to-[var(--dark-blue)] px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-[var(--white-background)] rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold vw-font mb-1">
                        {t.auth.login.title}
                    </h1>
                    <h2 className="text-lg vw-font leading-none">
                        {t.auth.login.caption}
                    </h2>
                </div>
                <div className="flex flex-col gap-4">
                    <input
                        name="email"
                        type="email"
                        placeholder={t.auth.login.inputs.email}
                        className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                    />
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t.auth.login.inputs.password}
                            className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                            minLength={8}
                            maxLength={128}
                        />
                        <ShowPassword show={showPassword} setShow={setShowPassword} />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 cursor-pointer"
                    >
                        {t.auth.login.button[isLoading ? "loading" : "login"]}
                    </button>
                </div>
                <div className="mt-3">
                    <p className="text-sm">{t.auth.footerText.noAccount}{" "}
                        <Link href="/register" className="font-semibold">{t.auth.footerText.register}</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}