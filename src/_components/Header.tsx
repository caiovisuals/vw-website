"use client"

import { useState } from "react"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import { useAuth } from "@/_lib/contexts/AuthContext"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const { user, isLoading, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    return (
        <header className="w-full flex items-center justify-center px-6 py-5 md:py-8 md:px-12 lg:px-20">
            <div className="w-[25%] flex justify-start items-center">
                <button onClick={() => setIsOpen(true)} className="size-15 p-3 rounded-full cursor-pointer">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
                    </svg>
                </button>
            </div>
            <div className="w-[50%] h-full flex items-center justify-center">
                <Link href="/" className="relative size-15 active:scale-95 hover:scale-105 transition-fast">
                    <Image src="/assets/logo-blue.png" alt="Volkswagen Logo" fill className="object-cover aspect-square select-none" draggable="false" />
                </Link>
            </div>
            <div className="w-[25%] flex justify-end">
                <button className="group relative size-15 p-3 rounded-full cursor-pointer">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                    </svg>
                    {!isLoading && user && (
                        <div className="absolute bg-[var(--dark-blue)] group-hover:bg-[var(--medium-blue)] p-1.5 rounded-full bottom-3.5 right-4 transition-normal" />
                    )}
                </button>
            </div>
            <div onClick={() => setIsOpen(false)} className={`fixed inset-0 z-50 bg-black/50 transition-normal ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0" }`}>
                <div onClick={(e) => e.stopPropagation()} className={`fixed flex flex-col gap-10 h-full w-[50%] bg-[var(--white-background)] rounded-r-3xl p-6 lg:p-10 transition-normal ${isOpen ? "opacity-100 translate-x-0" : "opacity-75 -translate-x-25" }`}>
                    <div className="flex flex-row items-start justify-between">
                        <div className="relative size-15">
                            <Image src="/assets/logo-blue.png" alt="Volkswagen Logo" fill className="object-cover aspect-square select-none" draggable="false" />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 opacity-50 hover:opacity-100 transition-normal active:scale-95 rounded-full cursor-pointer">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.useful}</label>
                            {!isLoading && user ? (
                                <>
                                    <Link href="/home" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.home}</Link>
                                    <Link href="/profile" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.profile}</Link>
                                    <a onClick={logout} href="/forgot-password" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.forgotPassword}</a>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.login}</Link>
                                    <Link href="/register" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.register}</Link>
                                    <Link href="/forgot-password" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.forgotPassword}</Link>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.buy}</label>
                            <Link href="/build-your-model" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.buildYourModel}</Link>
                            <Link href="/dealers" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.dealers}</Link>
                            <Link href="/sales-and-finance/consortium" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.consortium}</Link>
                            <Link href="/sales-and-finance/finance" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.finance}</Link>
                            <Link href="/sales-and-finance/pre-owned" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.preOwned}</Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.legal}</label>
                            <Link href="/legal-information" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.legalInformation}</Link>
                            <Link href="/terms-of-use" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.termsOfUse}</Link>
                            <Link href="/privacy-policies" className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.privacyPolicies}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
