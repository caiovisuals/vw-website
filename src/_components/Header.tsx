"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import { useAuth } from "@/_lib/contexts/AuthContext"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const { user, isLoading, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const { t } = useLanguage()

    const handleNavigate = () => {
        setIsMenuOpen(false)
    }

    const profileModalRef = useRef<HTMLDivElement>(null)

    const profileContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isProfileModalOpen &&
                profileContainerRef.current &&
                profileModalRef.current &&
                !profileContainerRef.current.contains(event.target as Node) &&
                !profileModalRef.current.contains(event.target as Node)
            ) {
                setIsProfileModalOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isProfileModalOpen])

    return (
        <header className="w-full flex items-center justify-center px-6 py-5 md:py-8 md:px-12 lg:px-20 relative">
            <div className="w-[25%] flex justify-start items-center">
                <button onClick={() => setIsMenuOpen(true)} className="size-15 p-3 rounded-full cursor-pointer">
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
                <div ref={profileContainerRef}>
                    <button onClick={() => setIsProfileModalOpen(prev => !prev)} className="group relative size-15 p-3 rounded-full cursor-pointer">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                        </svg>
                        {!isLoading && user && (
                            <div className="absolute bg-[var(--dark-blue)] group-hover:bg-[var(--medium-blue)] p-1.5 rounded-full bottom-3.5 right-4 transition-normal" />
                        )}
                    </button>
                </div>
            </div>
            <div onClick={() => setIsMenuOpen(false)} className={`fixed inset-0 z-50 bg-black/50 shadow-[0_0_15px_rgba(0,0,0,0.25)] transition-normal ${isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0" }`}>
                <div onClick={(e) => e.stopPropagation()} className={`fixed flex flex-col gap-10 h-full w-[50%] bg-[var(--white-background)] rounded-r-3xl p-6 lg:p-10 transition-normal ${isMenuOpen ? "opacity-100 translate-x-0" : "opacity-75 -translate-x-25" }`}>
                    <div className="flex flex-row items-start justify-between">
                        <div className="relative size-15">
                            <Image src="/assets/logo-blue.png" alt="Volkswagen Logo" fill className="object-cover aspect-square select-none" draggable="false" />
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 opacity-50 hover:opacity-100 transition-normal active:scale-95 rounded-full cursor-pointer">
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
                                    <Link href="/home" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.home}</Link>
                                    <Link href="/home/profile" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.profile}</Link>
                                    <a onClick={() => {
                                            logout()
                                            handleNavigate()
                                        }} className="hover:text-[var(--black-text-hover)] transition-fast cursor-pointer">{t.nav.logout}
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.login}</Link>
                                    <Link href="/register" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.register}</Link>
                                    <Link href="/forgot-password" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.forgotPassword}</Link>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.buy}</label>
                            <Link href="/build-your-model" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.buildYourModel}</Link>
                            <Link href="/dealers" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.dealers}</Link>
                            <Link href="/sales-and-finance/consortium" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.consortium}</Link>
                            <Link href="/sales-and-finance/finance" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.finance}</Link>
                            <Link href="/sales-and-finance/pre-owned" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.preOwned}</Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xl vw-font">{t.footer.legal}</label>
                            <Link href="/legal-information" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.legalInformation}</Link>
                            <Link href="/terms-of-use" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.termsOfUse}</Link>
                            <Link href="/privacy-policies" onClick={handleNavigate} className="hover:text-[var(--black-text-hover)] transition-fast">{t.nav.privacyPolicies}</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={profileModalRef} className={`absolute right-20 top-24 z-50 max-w-130 w-fit p-4 lg:p-5 rounded-xl bg-[var(--white-background)] shadow-[0_0_15px_rgba(0,0,0,0.25)] transition-normal ${isProfileModalOpen ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"}`}>
                {!isLoading && user ? (
                    <div className="flex flex-row gap-4 items-center">
                        <div className="relative size-12 rounded-full overflow-hidden cursor-pointer">
                            <Image src="/assets/avatar-default.jpg" alt="User Avatar" className="rounded-full object-cover" fill draggable="false" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="whitespace-nowrap text-lg font-semibold vw-font leading-tight">{user.name}</span>
                            <span className="whitespace-nowrap truncate vw-font leading-tight">{user.email}</span>
                        </div>
                        <Link href="/home/profile" onClick={() => setIsProfileModalOpen(false)} className="px-5 py-1.5 rounded-2xl text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] transition-normal">
                            Ver Perfil
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div>
                            <h1 className="text-xl font-semibold vw-font">Entre com a sua conta</h1>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link
                                href="/login"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="px-8 py-1.5 rounded-2xl text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] transition-normal"
                            >
                                {t.nav.login}
                            </Link>

                            <Link
                                href="/register"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="px-8 py-1.5 rounded-2xl text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] transition-normal"
                            >
                                {t.nav.register}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
