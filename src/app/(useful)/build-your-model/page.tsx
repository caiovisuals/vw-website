"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import Image from "next/image"
import FilterModal from "@/_components/modals/FilterModal"

const cars = [
    {
        id: 1,
        name: "Jetta",
        fuel: "flex",
        transmission: "automatic",
        image: "/assets/cars/jetta.webp"
    },
    {
        id: 2,
        name: "Nivus",
        fuel: "flex",
        transmission: "automatic",
        image: "/assets/cars/nivus.webp"
    }
]

export default function BuildYourModel() {
    const { t } = useLanguage()
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const [filters, setFilters] = useState({
        fuel: [] as string[],
        transmission: [] as string[],
    })

    function toggleFilter(type: "fuel" | "transmission", value: string) {
        setFilters(prev => {
            const exists = prev[type].includes(value)

            return {
                ...prev,
                [type]: exists
                    ? prev[type].filter(v => v !== value)
                    : [...prev[type], value]
            }
        })
    }

    function isActive(type: "fuel" | "transmission", value: string) {
        return filters[type].includes(value)
    }

    const filteredCars = cars.filter(car => {
        const fuelMatch =
            filters.fuel.length === 0 || filters.fuel.includes(car.fuel)

        const transmissionMatch =
            filters.transmission.length === 0 || filters.transmission.includes(car.transmission)

        return fuelMatch && transmissionMatch
    })

    function translateFuel(fuel: string) {
        switch (fuel) {
            case "flex":
                return "Flex"
            case "electric":
                return "Elétrico"
            default:
                return fuel
        }
    }

    function translateTransmission(transmission: string) {
        switch (transmission) {
            case "manual":
                return "Manual"
            case "automatic":
                return "Automático"
            default:
                return transmission
        }
    }

    function clearFilters() {
        setFilters({
            fuel: [],
            transmission: []
        })
        setIsModalOpen(false)
    }

    return (
        <div className="flex flex-col gap-4 px-6 py-6 md:py-10 md:px-12 lg:px-20">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-2xl lg:text-3xl vw-font font-semibold">{t.buildYourModel.title}</h1>
                <div className="relative flex items-center justify-center h-[28px] min-w-[20px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={filteredCars.length}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute text-xl"
                        >
                            {filteredCars.length}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
            <div>
                <div id="header" className="flex flex-row items-center justify-between gap-3">
                    <div className="flex flex-row gap-3">
                        <button onClick={() => toggleFilter("fuel", "flex")} className={`flex flex-row items-center justify-center gap-2 px-2.5 py-1 border-2 border-[var(--white-border)] hover:bg-[var(--white-border)]/15 rounded-2xl transition-normal cursor-pointer ${
                            isActive("fuel", "flex")
                                ? "bg-[var(--white-border)]/20"
                                : ""
                            }`}
                        >
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("fuel", "flex") ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("fuel", "flex") ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            Flex
                        </button>
                        <button onClick={() => toggleFilter("fuel", "electric")} className={`flex flex-row items-center justify-center gap-2 px-2.5 py-1 border-2 border-[var(--white-border)] hover:bg-[var(--white-border)]/15 rounded-2xl transition-normal cursor-pointer ${
                            isActive("fuel", "electric")
                                ? "bg-[var(--white-border)]/20"
                                : ""
                            }`}
                        >
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("fuel", "electric") ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("fuel", "electric") ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            Elétrico
                        </button>
                        <button onClick={() => toggleFilter("transmission", "manual")} className={`flex flex-row items-center justify-center gap-2 px-2.5 py-1 border-2 border-[var(--white-border)] hover:bg-[var(--white-border)]/15 rounded-2xl transition-normal cursor-pointer ${
                            isActive("transmission", "manual")
                                ? "bg-[var(--white-border)]/20"
                                : ""
                            }`}
                        >
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("transmission", "manual") ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("transmission", "manual") ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            Manual
                        </button>
                        <button onClick={() => toggleFilter("transmission", "automatic")} className={`flex flex-row items-center justify-center gap-2 px-2.5 py-1 border-2 border-[var(--white-border)] hover:bg-[var(--white-border)]/15 rounded-2xl transition-normal cursor-pointer ${
                            isActive("transmission", "automatic")
                                ? "bg-[var(--white-border)]/20"
                                : ""
                            }`}
                        >
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("transmission", "automatic") ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${isActive("transmission", "automatic") ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            Automatico
                        </button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="hidden lg:flex flex-row items-center justify-center gap-2 px-2.5 py-1 border-2 border-[var(--white-border)] hover:bg-[var(--white-border)]/15 rounded-2xl transition-normal cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>
                        </svg>
                        {t.buildYourModel.showMoreFilters}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex lg:hidden flex-row items-center justify-center gap-2 px-2.5 py-1 border-2 border-[var(--white-border)] hover:bg-[var(--white-border)]/15 rounded-2xl transition-normal cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>
                        </svg>
                        {t.buildYourModel.filters}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredCars.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <h3 className="text-2xl">
                                {t.buildYourModel.noResults}
                            </h3>
                            <p className="text-lg opacity-75">
                                {t.buildYourModel.noResultsDescription}
                            </p>
                        </div>
                    ) : (
                        filteredCars.map(car => (
                            <Link 
                                href="/build-your-model/setting"
                                key={car.id}
                                className="group relative flex flex-col gap-3 rounded-2xl py-5 px-5.5 cursor-pointer"
                            >   
                                <div>
                                    <h2 className="text-xl font-semibold">{car.name}</h2>
                                    <div className="flex flex-row gap-2 items-center justify-start">
                                        <p className="text-sm opacity-70">{translateFuel(car.fuel)}</p>
                                        <div className="size-1 bg-[var(--black-text)]/70 rounded-full"/>
                                        <p className="text-sm opacity-70">{translateTransmission(car.transmission)}</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 w-full h-[70%] border-2 border-[var(--white-border)] group-hover:border-[var(--white-border-hover)] rounded-2xl transition-normal z-10" />
                                <div>
                                    <div className="absolute inset-0 w-full top-[28%] h-[42%] bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)] group-hover:opacity-0 rounded-2xl transition-normal z-9" />
                                    <div className="absolute inset-0 w-full top-[28%] h-[42%] bg-[radial-gradient(circle,_#BCBCBC_0%,_#999999_100%)] rounded-2xl transition-normal z-8" />
                                </div>
                                <Image src={car.image} alt={car.name} className="w-full h-50 group-hover:scale-105 group-active:scale-95 object-contain transition-normal z-11 select-none" width={864} height={432} draggable="false" />
                            </Link>  
                        )
                    ))}
                </div>
            </div>
            <FilterModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                filters={filters}
                toggleFilter={toggleFilter}
                isActive={isActive}
                clearFilters={clearFilters}
            />
        </div>
    )
}