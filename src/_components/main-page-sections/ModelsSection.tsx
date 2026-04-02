"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const cars = [
    { name: "Jetta", image: "/assets/cars/jetta/jetta.webp", slug: "jetta" },
    { name: "Nivus", image: "/assets/cars/nivus/nivus.webp", slug: "nivus" },
    { name: "Taos", image: "/assets/cars/taos/taos.webp", slug: "taos" },
    { name: "Amarok", image: "/assets/cars/amarok/amarok.webp", slug: "amarok" },
    { name: "Saveiro", image: "/assets/cars/saveiro/saveiro.webp", slug: "saveiro" },
    { name: "Polo", image: "/assets/cars/polo/polo.webp", slug: "polo" },
]

export default function ModelsSection() {
    const { t } = useLanguage()
    const router = useRouter()
    const listRef = useRef<HTMLUListElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const updateScrollButtons = () => {
        if (!listRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = listRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
    }
    
    useEffect(() => {
        updateScrollButtons()
        const handleResize = () => updateScrollButtons()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const scroll = (direction: "left" | "right") => {
        if (!listRef.current) return
        const scrollAmount = listRef.current.clientWidth * 0.7
        listRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        })
    }

    return (
        <section id="models" className="flex flex-col items-center justify-center gap-16 py-6 md:py-10 lg:py-15 xl:py-20 px-6 md:px-10 lg:px-15 xl:px-20 -mb-6 md:-mb-12 lg:-mb-20">
            <div className="flex flex-col gap-3 items-center justify-center max-w-250">
                <h2 className="text-center text-4xl vw-font">Encontre o seu <span className="font-semibold">Volkswagen</span></h2>
                <p className="text-center text-lg leading-tight">Conheça os modelos recomendados, em destaque, veículos elétricos ou explore todos para escolher o seu Volkswagen que mais combine com você.</p>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="text-center text-3xl vw-font font-semibold">Modelos Recomendados</h2>
                <div className="relative flex flex-col gap-4 w-full">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <Link href="/build-your-model" className="px-3 py-1 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:95">
                            Vê todos disponíveis
                        </Link>
                        <span>São mais de <b>10 modelos</b></span>
                    </div>
                    <button
                        onClick={() => scroll("left")}
                        className={`absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] p-3 rounded-full shadow-md transition-normal cursor-pointer ${canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                        aria-label="Scroll para a esquerda"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className={`absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] p-3 rounded-full shadow-md transition-normal cursor-pointer ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                        aria-label="Scroll para a direita"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                        </svg>
                    </button>
                    <ul role="listbox" aria-orientation="horizontal" aria-label="Controle deslizante de seleção de carros" ref={listRef} onScroll={updateScrollButtons} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar max-w-full">
                        {cars.map((car) => (
                            <li key={car.name} onClick={() => router.push(`/car/${car.slug}`)} role="option" className="flex-shrink-0 snap-start group relative flex flex-col items-center gap-3 rounded-2xl py-5 px-2.5 cursor-pointer">   
                                <div>
                                    <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#BCBCBC_0%,_#999999_100%)] rounded-2xl transition-normal z-8" />
                                    <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)] group-hover:opacity-0 rounded-2xl transition-normal z-9" />
                                </div>
                                <Image src={car.image} alt={car.name} className="w-full h-35 lg:h-40 xl:h-50 group-hover:scale-105 group-active:scale-95 object-contain transition-normal z-11 select-none" width={864} height={432} draggable="false" />
                                <div>
                                    <h2 className="text-xl font-semibold text-center">{car.name}</h2>
                                </div>
                                <Link href="/build-your-model/setting" onClick={(e) => e.stopPropagation()} className="px-8 py-1.5 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-2xl transition-normal active:95 w-fit opacity-0 group-hover:opacity-100 scale-y-95 translate-y-2 group-hover:scale-y-100 group-hover:translate-y-0">
                                    Montar o seu
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}