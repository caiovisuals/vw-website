"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import SeeTechnicalDataModal from "@/_components/modals/SeeTechnicalDataModal"

export default function Setting() {
    const { t } = useLanguage()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [openSections, setOpenSections] = useState({
        colors: false,
        wheels: false,
        interior: false,
        seats: false,
        technology: false
    })

    function toggle(section: keyof typeof openSections) {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const [isInteriorView, setIsInteriorView] = useState(false)

    return (
        <div className="flex flex-col gap-2 px-6 py-6">
            <nav className="flex flex-row items-center gap-x-1.5 text-sm sm:text-base flex-wrap">
                <Link href="/">Início</Link>
                <span>/</span>
                <Link href="/build-your-model">Modelos</Link>
                <span>/</span>
                <span className="font-medium truncate">Jetta</span>
            </nav>
            <div className="flex flex-col lg:flex-row gap-8">
                <div id="canvas" className="h-full max-h-250 w-full lg:w-[65%] relative">
                    <div className="relative min-h-100 max-h-200 h-150 w-full rounded-xl overflow-hidden">
                        <Image src={isInteriorView ? "/assets/settings/interna.png" : "/assets/settings/base.jpg"} alt={isInteriorView ? "Interior do Jetta" : "Jetta Foto"}  className="object-cover" draggable="false" fill />
                    </div>
                    <button 
                        onClick={() => setIsInteriorView(prev => !prev)} 
                        className="absolute bottom-4 left-4 px-3 py-2 bg-[var(--dark-blue)] text-[var(--white-text)] rounded-xl hover:bg-[var(--medium-blue)] transition-normal active:scale-95 cursor-pointer z-10"
                    >
                        {isInteriorView ? 
                            <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>
                                </svg>
                            </> : <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/>
                                </svg>
                            </>
                        }
                    </button>
                </div>
                <div className="h-full w-full lg:w-[35%] gap-5 overflow-y-auto overflow-x-hidden flex flex-col">
                    <div className="flex flex-row items-center justify-between gap-1">
                        <div>
                            <h1 className="text-2xl lg:text-3xl vw-font font-semibold">Jetta</h1>
                            <span className="text-xl font-semibold">GLI 2026</span>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="px-3 py-1 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:95 cursor-pointer">
                            Ver dados técnicos
                        </button>
                    </div>
                    <section className="flex flex-col gap-3">
                        <div onClick={() => toggle("colors")} id="colors" className="group cursor-pointer">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <h2 className="text-lg group-hover:ml-1.5 transition-normal">Cores</h2>
                                <div className={`relative size-[22px]`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.colors ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                                        <path d="M5 12h14"/><path d="M12 5v14"/>
                                    </svg>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.colors ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                                        <path d="M5 12h14"/>
                                    </svg>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-normal ${openSections.colors ? "max-h-80 mt-2" : "max-h-0"}`}>
                            </div>
                        </div>
                        <div onClick={() => toggle("wheels")} id="wheels" className="group cursor-pointer">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <h2 className="text-lg group-hover:ml-1.5 transition-normal">Rodas</h2>
                                <div className={`relative size-[22px]`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.wheels ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                                        <path d="M5 12h14"/><path d="M12 5v14"/>
                                    </svg>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.wheels ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                                        <path d="M5 12h14"/>
                                    </svg>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-normal ${openSections.wheels ? "max-h-80 mt-2" : "max-h-0"}`}>
                            </div>
                        </div>
                        <div onClick={() => toggle("interior")} id="interior" className="group cursor-pointer">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <h2 className="text-lg group-hover:ml-1.5 transition-normal">Interior</h2>
                                <div className={`relative size-[22px]`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.interior ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                                        <path d="M5 12h14"/><path d="M12 5v14"/>
                                    </svg>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.interior ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                                        <path d="M5 12h14"/>
                                    </svg>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-normal ${openSections.interior ? "max-h-80 mt-2" : "max-h-0"}`}>
                            </div>
                        </div>
                        <div onClick={() => toggle("seats")} id="seats" className="group cursor-pointer">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <h2 className="text-lg group-hover:ml-1.5 transition-normal">Bancos</h2>
                                <div className={`relative size-[22px]`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.seats ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                                        <path d="M5 12h14"/><path d="M12 5v14"/>
                                    </svg>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.seats ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                                        <path d="M5 12h14"/>
                                    </svg>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-normal ${openSections.seats ? "max-h-80 mt-2" : "max-h-0"}`}>
                            </div>
                        </div>
                        <div onClick={() => toggle("technology")} id="technology" className="group cursor-pointer">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <h2 className="text-lg group-hover:ml-1.5 transition-normal">Tecnologia</h2>
                                <div className={`relative size-[22px]`}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.technology ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                                        <path d="M5 12h14"/><path d="M12 5v14"/>
                                    </svg>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${openSections.technology ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                                        <path d="M5 12h14"/>
                                    </svg>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-normal ${openSections.technology ? "max-h-80 mt-2" : "max-h-0"}`}>
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">Preço Base</span>
                                <span className="leading-tight">R$ 280.000,00</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">Seu Preço Customizado</span>
                                <span className="leading-tight">R$ 340.000,00</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <button className="text-base md:text-lg px-5 py-3 bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] rounded-2xl transition-normal active:scale-95 cursor-pointer">Contatar Concessionária VW</button>
                            <div className="flex flex-col md:flex-row gap-2.5">
                                <button className="text-base md:text-lg flex-1 px-5 py-3 bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] rounded-2xl transition-normal active:scale-95 cursor-pointer">Salvar</button>
                                <button className="text-base md:text-lg flex-1 px-5 py-3 bg-[var(--white-background)] border-2 rounded-2xl transition-normal active:scale-95 cursor-pointer">Criar código de customização</button>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm">Os valores não incluem frete doméstico. Preços públicos sugeridos. Valores válidos para versões básicas. Consulte um revendedor sobre a disponibilidade de sua configuração.</p>
                        </div>
                    </section>
                </div>
            </div>
            <SeeTechnicalDataModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}