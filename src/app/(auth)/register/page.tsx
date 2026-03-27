"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ShowPassword from "@/_components/ui/ShowPassword"

type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword" | "phone", string>>

export default function Register() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [globalError, setGlobalError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setGlobalError(null)
        setFieldErrors({})
 
        const form = e.currentTarget
        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim()
        const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim()
        const password = (form.elements.namedItem("password") as HTMLInputElement).value
        const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value

        if (!email.includes("@")) {
            setFieldErrors({ email: "Email inválido." })
            return
        }
 
        if (password !== confirmPassword) {
            setFieldErrors({ confirmPassword: "As senhas não conferem." })
            return
        }
 
        setIsLoading(true)
 
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })
 
            const json = await res.json()
 
            if (!res.ok) {
                if (json.fields) {
                    setFieldErrors(json.fields as FieldErrors)
                } else {
                    setGlobalError(json.error ?? "Erro ao criar conta.")
                }
                return
            }
 
            router.push("/login?registered=1")
        } catch {
            setGlobalError("Erro de conexão. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[75vh] max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-124px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#202020] to-[var(--dark-blue)] px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-[var(--white-background)] rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold vw-font">
                        Cadastrar
                    </h1>
                    <h2 className="text-lg vw-font">
                        Crie a sua conta de forma simples e fácil
                    </h2>
                </div>
                <div className="flex flex-col gap-4">
                    <input
                        name="name"
                        type="text"
                        placeholder="Nome"
                        className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                        maxLength={512}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                        minLength={4}
                        maxLength={256}
                    />
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                            minLength={8}
                            maxLength={128}
                        />
                        <ShowPassword show={showPassword} setShow={setShowPassword} />
                    </div>
                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirmar Senha"
                            className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                            minLength={8}
                            maxLength={128}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 cursor-pointer"
                    >
                        Criar Conta
                    </button>
                </div>
                <div className="flex flex-col mt-3">
                    <p className="text-sm">Ao criar a sua conta, você está declarando estar de acordo com os nossos{" "}
                        <Link href="terms-of-use" className="font-semibold">Termos de Uso</Link>.
                    </p>
                    <p className="text-sm">Já tem uma conta?{" "}
                        <Link href="/login" className="font-semibold">Faça login</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}