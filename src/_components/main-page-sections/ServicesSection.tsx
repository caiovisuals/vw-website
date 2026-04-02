"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function ServicesSection() {
    const { t } = useLanguage()

    return (
        <section id="services" className="flex flex-col items-center justify-center gap-16 py-6 md:py-10 lg:py-15 xl:py-20 px-6 md:px-10 lg:px-15 xl:px-20 -mb-6 md:-mb-12 lg:-mb-20">
            <div className="flex flex-col gap-3 items-center justify-center max-w-250">
                <h2 className="text-center text-4xl vw-font">Para o seu <span className="font-semibold">Volkswagen</span></h2>
                <p className="text-center text-lg leading-tight">Confira os Serviços, Peças e Acessórios para ir ainda mais longe com o seu Volkswagen.</p>
            </div>
            <div className="flex flex-col gap-3">
            </div>
        </section>
    )
}