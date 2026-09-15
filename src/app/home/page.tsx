"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import AuthGate from "@/_components/AuthGate"
import { api, formatBRL, formatDate } from "@/_lib/utils/apiClient"
import type { AuthUser } from "@/_lib/contexts/AuthContext"

type SavedConfig = {
    id: string
    code: string
    totalPrice: string
    updatedAt: string
    car: { name: string; slug: string; imageUrl: string | null }
}

type Offer = {
    id: string
    name: string
    title: string
    subtitle: string | null
    model: string
    price: string
    discount: string | null
    imageUrl: string
    badge: string | null
    validUntil: string | null
}

function greeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
}

const shortcuts = [
    {
        href: "/build-your-model",
        title: "Monte o seu",
        description: "Escolha cores, rodas, bancos e tecnologias.",
        icon: (
            <>
                <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" /><path d="M7 14h.01" /><path d="M17 14h.01" /><rect width="18" height="8" x="3" y="10" rx="2" /><path d="M5 18v2" /><path d="M19 18v2" />
            </>
        ),
    },
    {
        href: "/sales-and-finance/finance",
        title: "Simule o financiamento",
        description: "Calcule a parcela antes de ir à concessionária.",
        icon: (
            <>
                <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
            </>
        ),
    },
    {
        href: "/dealers",
        title: "Concessionárias",
        description: "Encontre a unidade mais próxima de você.",
        icon: (
            <>
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
            </>
        ),
    },
    {
        href: "/sales-and-finance/pre-owned",
        title: "Seminovos",
        description: "Modelos revisados com garantia de fábrica.",
        icon: (
            <>
                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </>
        ),
    },
]

function HomeContent({ user }: { user: AuthUser }) {
    const [configs, setConfigs] = useState<SavedConfig[]>([])
    const [offers, setOffers] = useState<Offer[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let active = true

        async function load() {
            const [configsRes, offersRes] = await Promise.all([
                api.get<SavedConfig[]>("/api/configurations"),
                api.get<Offer[]>("/api/offers?type=novo"),
            ])

            if (!active) return

            if (configsRes.ok && configsRes.data) setConfigs(configsRes.data)
            if (offersRes.ok && offersRes.data) setOffers(offersRes.data.slice(0, 3))
            setIsLoading(false)
        }

        load()
        return () => { active = false }
    }, [])

    return (
        <div className="flex flex-col gap-12 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-semibold vw-font">{greeting()}, {user.name.split(" ")[0]}!</h1>
                    <h3 className="text-xl vw-font">Confira as novidades enquanto você esteve fora.</h3>
                </div>
                <Link href="/home/profile" className="flex items-center justify-center gap-2 whitespace-nowrap px-6 py-2 rounded-xl border-2 border-[var(--dark-blue)] text-[var(--dark-blue)] hover:bg-[var(--dark-blue)] hover:text-[var(--white-text)] font-semibold transition-normal active:scale-95 w-fit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Meu perfil
                </Link>
            </div>

            <section className="flex flex-col gap-4">
                <div className="flex flex-row items-end justify-between gap-4">
                    <h2 className="text-2xl font-semibold vw-font">Suas configurações salvas</h2>
                    {configs.length > 0 && (
                        <Link href="/home/profile#configuracoes" className="text-[var(--dark-blue)] hover:text-[var(--medium-blue)] underline transition-normal whitespace-nowrap">
                            Ver todas
                        </Link>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-64 rounded-3xl bg-[var(--white-text-hover)]/40 animate-pulse" />
                        ))}
                    </div>
                ) : configs.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 text-center border-2 border-dashed border-[var(--white-text-hover)] rounded-3xl py-12 px-6">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--black-text-hover)]">
                            <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" /><path d="M7 14h.01" /><path d="M17 14h.01" /><rect width="18" height="8" x="3" y="10" rx="2" /><path d="M5 18v2" /><path d="M19 18v2" />
                        </svg>
                        <p className="text-lg vw-font">Você ainda não salvou nenhuma configuração.</p>
                        <Link href="/build-your-model" className="px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">
                            Montar meu Volkswagen
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {configs.slice(0, 3).map((config) => (
                            <article key={config.id} className="flex flex-col border-2 border-[var(--white-text-hover)] rounded-3xl overflow-hidden hover:shadow-md transition-normal">
                                <div className="relative h-40 bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)]">
                                    {config.car.imageUrl && (
                                        <Image src={config.car.imageUrl} alt={config.car.name} className="object-contain select-none p-4" draggable="false" fill sizes="(max-width: 768px) 100vw, 33vw" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 p-5">
                                    <span className="text-sm text-[var(--black-text-hover)]">Código {config.code}</span>
                                    <h3 className="text-xl font-semibold vw-font">{config.car.name}</h3>
                                    <p className="text-lg font-semibold">{formatBRL(config.totalPrice)}</p>
                                    <span className="text-sm text-[var(--black-text-hover)]">Atualizada em {formatDate(config.updatedAt)}</span>
                                    <Link href={`/car/${config.car.slug}`} className="mt-3 w-full text-center px-5 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">
                                        Ver modelo
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold vw-font">Atalhos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {shortcuts.map((shortcut) => (
                        <Link key={shortcut.href} href={shortcut.href} className="group flex flex-col gap-2 p-6 rounded-3xl border-2 border-[var(--white-text-hover)] hover:border-[var(--dark-blue)] transition-normal">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--dark-blue)] group-hover:scale-110 transition-normal">
                                {shortcut.icon}
                            </svg>
                            <span className="text-lg font-semibold vw-font">{shortcut.title}</span>
                            <span className="text-sm text-[var(--black-text-hover)]">{shortcut.description}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {offers.length > 0 && (
                <section className="flex flex-col gap-4">
                    <div className="flex flex-row items-end justify-between gap-4">
                        <h2 className="text-2xl font-semibold vw-font">Ofertas do momento</h2>
                        <Link href="/sales-and-finance/offers" className="text-[var(--dark-blue)] hover:text-[var(--medium-blue)] underline transition-normal whitespace-nowrap">
                            Ver todas
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {offers.map((offer) => (
                            <article key={offer.id} className="flex flex-col border-2 border-[var(--white-text-hover)] rounded-3xl overflow-hidden hover:shadow-md transition-normal">
                                <div className="relative h-48">
                                    <Image src={offer.imageUrl} alt={offer.name} className="object-cover select-none" draggable="false" fill sizes="(max-width: 768px) 100vw, 33vw" />
                                    {offer.badge && (
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold bg-[var(--dark-blue)] text-[var(--white-text)]">
                                            {offer.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 p-5">
                                    <span className="text-sm text-[var(--black-text-hover)] font-semibold vw-font">Modelo {offer.name}</span>
                                    <h3 className="text-lg font-semibold vw-font">{offer.title}</h3>
                                    {offer.subtitle && <p className="text-sm text-[var(--black-text-hover)]">{offer.subtitle}</p>}
                                    <p className="text-xl font-bold mt-1.5">{formatBRL(offer.price)}</p>
                                    {offer.validUntil && (
                                        <span className="text-sm text-[var(--black-text-hover)]">Válida até {formatDate(offer.validUntil)}</span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default function Home() {
    return (
        <AuthGate>
            {(user) => <HomeContent user={user} />}
        </AuthGate>
    )
}