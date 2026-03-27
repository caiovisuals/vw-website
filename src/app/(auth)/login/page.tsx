"use client"

import Link from "next/link"
import { useState } from "react"
import ShowPassword from "@/_components/ui/ShowPassword"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-[75vh] max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-124px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#202020] to-[var(--dark-blue)] px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <form className="w-full max-w-md bg-[var(--white-background)] rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="mb-6">
                    <h1 className="text-4xl font-semibold vw-font">
                        Login
                    </h1>
                    <h2 className="text-lg vw-font">
                        Faça login com suas credenciais
                    </h2>
                </div>
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            className="w-full px-3 py-2 rounded-lg hover:bg-[var(--white-border)]/10 outline-none border-2 border-[var(--white-border)] focus:border-[var(--white-border-hover)] transition-normal"
                            minLength={8}
                            maxLength={128}
                        />
                        <ShowPassword show={showPassword} setShow={setShowPassword} />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 cursor-pointer"
                    >
                        Entrar
                    </button>
                </div>
                <div className="mt-3">
                    <p className="text-sm">Ainda não tem uma conta?{" "}
                        <Link href="/register" className="font-semibold">Registre-se</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}