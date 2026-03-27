"use client"

import { useState } from "react"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    return (
        <header className="w-full flex items-center justify-center px-6 py-5 md:py-8 md:px-12 lg:px-20">
            <Link href="/" className="relative size-15 active:scale-95 hover:scale-105 transition-fast">
                <Image src="/assets/logo-blue.png" alt="Volkswagen Logo" fill className="object-cover aspect-square select-none" draggable="false" />
            </Link>
            <div onClick={() => setIsOpen(false)} className={`fixed inset-0 z-50 bg-black/50 transition-normal ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0" }`}>
                <div onClick={(e) => e.stopPropagation()} className={`fixed flex flex-col gap-10 h-full w-[50%] bg-[var(--white-background)] rounded-r-3xl p-6 transition-normal ${isOpen ? "opacity-100 translate-x-0" : "opacity-75 -translate-x-25" }`}>
                    <div className="flex flex-row items-start justify-between">
                        <div className="relative size-15">
                            <Image src="/assets/logo-blue.png" alt="Volkswagen Logo" fill className="object-cover aspect-square select-none" draggable="false" />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100 transition-normal active:scale-95 cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.useful}</label>
                            <Link href="/login" className="hover:text-[var(--black-text-hover)] transition-fast">Logar</Link>
                            <Link href="/register" className="hover:text-[var(--black-text-hover)] transition-fast">Cadastrar</Link>
                            <Link href="/forgot-password" className="hover:text-[var(--black-text-hover)] transition-fast">Esqueci minha Senha</Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.buy}</label>
                            <Link href="/build-your-model" className="hover:text-[var(--black-text-hover)] transition-fast">Monte seu Modelo</Link>
                            <Link href="/dealers" className="hover:text-[var(--black-text-hover)] transition-fast">Concessionárias</Link>
                            <Link href="/consortium" className="hover:text-[var(--black-text-hover)] transition-fast">Consórcio</Link>
                            <Link href="/sales-and-finance/consortium" className="hover:text-[var(--black-text-hover)] transition-fast">Consórcio</Link>
                            <Link href="/sales-and-finance/finance" className="hover:text-[var(--black-text-hover)] transition-fast">Financiamento</Link>
                            <Link href="/sales-and-finance/pre-owned" className="hover:text-[var(--black-text-hover)] transition-fast">Seminovos</Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.legal}</label>
                            <Link href="/legal-information" className="hover:text-[var(--black-text-hover)] transition-fast">Informação Legal</Link>
                            <Link href="/terms-of-use" className="hover:text-[var(--black-text-hover)] transition-fast">Termos de Uso</Link>
                            <Link href="/privacy-policies" className="hover:text-[var(--black-text-hover)] transition-fast">Politicas de Privacidade</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
