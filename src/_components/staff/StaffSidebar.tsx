"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/_lib/contexts/AuthContext"

const navItems = [
    {
        href: "/staff",
        label: "Dashboard",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
        ),
    },
    {
        href: "/staff/offers",
        label: "Ofertas",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
                <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
            </svg>
        ),
    },
    {
        href: "/staff/leads",
        label: "Leads",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
        ),
    },
    {
        href: "/staff/cars",
        label: "Carros",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
            </svg>
        ),
    },
    {
        href: "/staff/dealers",
        label: "Concessionárias",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
        ),
    },
    {
        href: "/staff/finance",
        label: "Financiamentos",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
    },
    {
        href: "/staff/users",
        label: "Usuários",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
]

export default function StaffSidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--dark-blue)] flex flex-col z-40 overflow-y-auto">
            <div className="flex items-center gap-3 px-4 py-5">
                <div className="relative size-8 flex-shrink-0">
                    <Image src="/assets/logo-white.png" alt="Volkswagen Logo" fill className="object-contain" draggable="false" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-[var(--white-text)] text-md vw-font">Staff Panel</span>
                    <span className="text-white/50 text-xs">{user?.role}</span>
                </div>
            </div>

            <nav className="flex flex-col gap-0.5 p-3 flex-1">
                {navItems.map((item) => {
                    const isActive = item.href === "/staff"
                        ? pathname === "/staff"
                        : pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-normal ${
                                isActive
                                    ? "bg-white/15 text-[var(--white-text)]"
                                    : "text-white/60 hover:text-[var(--white-text)] hover:bg-white/10"
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-3">
                {user && (
                    <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                        <div className="relative size-8 rounded-full flex items-center justify-center flex-shrink-0">
                            <Image src={user.avatarUrl || "/assets/avatar-default.jpg"} alt={user.name} width={32} height={32} className="rounded-full" draggable={false} />
                        </div>
                        <span className="text-[var(--white-text)] text-base truncate">{user.name}</span>
                    </div>
                )}
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-[var(--white-text)] hover:bg-white/10 transition-normal"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Voltar para o Site
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-[var(--white-text)] hover:bg-white/10 transition-normal cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sair
                </button>
            </div>
        </aside>
    )
}