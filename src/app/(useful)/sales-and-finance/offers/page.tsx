"use client"

import { useState } from "react"
import Image from "next/image"

type Offer = {
    id: number
    name: string
    title: string
    category: "hatch" | "suv" | "sedan"
    model: string
    type: "novo" | "seminovo"
    price: number
    image: string
}

const offers: Offer[] = [
    {
        id: 1,
        name: "Jetta",
        title: "Jetta GLI + Entrada de até R$ 20.000,00",
        category: "sedan",
        model: "jetta",
        type: "novo",
        price: 145000,
        image: "/assets/cars/jetta/offer.webp",
    },
    {
        id: 2,
        name: "Nivus",
        title: "Nivus Highline + Bônus de até R$ 30.000",
        category: "suv",
        model: "nivus",
        type: "novo",
        price: 110000,
        image: "/assets/cars/nivus/offer.webp",
    },
    {
        id: 3,
        name: "Polo",
        title: "Polo TSI + Apatir de R$ 45.000,00",
        category: "hatch",
        model: "polo",
        type: "seminovo",
        price: 45000,
        image: "/assets/cars/polo/offer.webp",
    },
]

export default function Offers() {
    const [category, setCategory] = useState<string | null>(null)
    const [model, setModel] = useState<string | null>(null)
    const [type, setType] = useState<string | null>(null)

    const filteredOffers = offers.filter((offer) => {
        return (
            (!category || offer.category === category) &&
            (!model || offer.model === model) &&
            (!type || offer.type === type)
        )
    })

    return (
        <div className="flex flex-col items-center justify-center gap-16 py-6 md:py-10 lg:py-15 xl:py-20 px-6 md:px-10 lg:px-15 xl:px-20">
            <div id="header" className="w-full pt-8 sm:pt-10 md:pt-12 lg:pt-16">
                <h1 className="text-2xl lg:text-3xl font-semibold vw-font">Encontre seu novo <span className="font-semibold">Volkswagen</span></h1>
                <h3 className="text-xl vw-font">Oportunidades de ofertas especiais para você</h3>
            </div>
            <section id="offers" className="flex flex-col gap-6 w-full max-w-350">
                <div className="flex flex-row gap-5 items-center justify-between">
                    <div className="flex flex-row items-center gap-2 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
                        </svg>
                        <span>Selecione a categoria</span>
                    </div>
                    <div className="flex flex-row items-center gap-2 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>
                        </svg>
                        <span>Selecione o modelo</span>
                    </div>
                    <div className="flex flex-row items-center gap-2 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
                        </svg>
                        <span>Selecione o tipo de compra</span>
                    </div>
                </div>
                <div className="grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOffers.length > 0 ? (
                        filteredOffers.map((offer) => (
                            <div key={offer.id} className="border-2 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                
                                <Image
                                    src={offer.image}
                                    alt={offer.name}
                                    width={400}
                                    height={200}
                                    className="w-full h-70 object-cover"
                                />

                                <div className="p-4">
                                    <h3 className="text-sm text-[var(--black-text-hover)] font-semibold vw-font">Modelo {offer.name}</h3>
                                    <h2 className="text-xl font-semibold vw-font">{offer.title}</h2>
                                    <p className="text-sm text-[var(--black-text-hover)] capitalize">
                                        {offer.category} • {offer.type}
                                    </p>

                                    <p className="text-xl font-bold mt-1.5">
                                        R$ {offer.price.toLocaleString("pt-BR")}
                                    </p>

                                    <button className="mt-2 w-full bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-white px-5 py-2 rounded-lg transition-normal cursor-pointer">
                                        Ver oferta
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p>Nenhuma oferta encontrada.</p>
                    )}
                </div>
            </section>
            <section id="conditions" className="flex flex-col gap-3 max-w-350">
                <h2 className="text-xl font-semibold vw-font">Condições</h2>
                <p>
                    No site real, as condições válidas são para o financiamento pelo Banco Volkswagen com Capitalização de juros mensal. Aqui é apenas um exemplo de como as condições podem ser apresentadas.
                </p>
            </section>
        </div>
    )
}