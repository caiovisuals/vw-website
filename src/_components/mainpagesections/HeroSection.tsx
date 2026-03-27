"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function HeroSection() {
    const { t } = useLanguage()
    
    return (
        <section id="hero" className="relative flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-124px)] overflow-hidden">
            <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/assets/hero-videos/hero-1.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute inset-0 z-10 flex items-center justify-start px-6 md:px-12 lg:px-20">
                <div className="max-w-150 flex flex-col drop-shadow-[0_2px_15px_rgba(0,0,0,0.75)]">
                    <h1 className="text-[clamp(2rem,5vw,4rem)] vw-font text-[var(--white-text)] leading-tight md:leading-normal text-center md:text-start">O novo Nivus</h1>
                    <h1 className="text-[clamp(1rem,2.2vw,1.5rem)] vw-font text-[var(--white-text)] leading-tight text-center md:text-start">Conectividade, design e um looping de emoções. Com novas tecnologias e agora conectado!</h1>
                </div>
            </div>
        </section>
    )
}