"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/_lib/contexts/AuthContext"

export default function Profile() {
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

    type Role = "USER" | "STAFF" | "ADMIN"

    function getRoleLabel(role: Role) {
        switch (role) {
            case "ADMIN": return "Administrador"
            case "STAFF": return "Equipe"
            default: return "Cliente"
        }
    }

    return(
        <div className="flex flex-col gap-4 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="flex flex-col">
                <div className="relative">
                    <div className="w-full h-60 bg-gradient-to-br from-black to-[var(--dark-blue)] rounded-3xl" />
                    <button className="absolute top-5 right-5 p-2 rounded-xl bg-[var(--white-background)] hover:bg-[var(--white-text-hover)] aspect-square transition-normal cursor-pointer">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                        </svg>
                    </button>
                </div>
                <div className="p-6 -mt-25">
                    <div className="relative size-40 border-5 border-[var(--white-background)] rounded-full aspect-square">
                        <Image src="/assets/avatar-default.jpg" alt="User Avatar" className="object-cover aspect-square rounded-full bg-[var(--white-background)] select-none" draggable="false" fill />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold vw-font">{user.name}</h1>
                        <span className="text-xl vw-font leading-tight">{getRoleLabel(user.role)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}