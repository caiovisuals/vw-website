"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/_lib/contexts/LanguageContext"

interface Slide {
    video: string
    title: string
    subtitle: string
}

export default function HeroSection() {
    const { t } = useLanguage()

    const slides: Slide[] = [
        {
            video: "/assets/hero-videos/nivus.mp4",
            title: t.hero.nivus.title,
            subtitle: t.hero.nivus.subtitle,
        },
        {
            video: "/assets/hero-videos/taos.mp4",
            title: t.hero.taos.title,
            subtitle: t.hero.taos.subtitle
        },
        {
            video: "/assets/hero-videos/polo.mp4",
            title: t.hero.polo.title,
            subtitle: t.hero.polo.subtitle
        }
    ]

    const [currentSlide, setCurrentSlide] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        video.load()
        video.play()

        const handleEnded = () => nextSlide()
        video.addEventListener("ended", handleEnded)

        return () => {
        video.removeEventListener("ended", handleEnded)
        }
    }, [currentSlide])
    
    return (
        <section id="hero" className="relative flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-124px)] overflow-hidden">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-9 transition-normal"
                src={slides[currentSlide].video}
                autoPlay
                loop={false}
                muted
                playsInline
            />
            <div className="absolute inset-0 z-10 flex items-center justify-start px-6 md:px-12 lg:px-20 transition-normal">
                <div className="max-w-150 flex flex-col gap-2 sm:gap-3 md:gap-4.5 drop-shadow-[0_2px_15px_rgba(0,0,0,0.75)]">
                    <h1 className="text-[clamp(2rem,5vw,4rem)] vw-font text-[var(--white-text)] leading-none text-center md:text-start">
                        {slides[currentSlide].title}
                    </h1>
                    <h1 className="text-[clamp(1rem,2.2vw,1.5rem)] vw-font text-[var(--white-text)] leading-tight text-center md:text-start">
                        {slides[currentSlide].subtitle}
                    </h1>
                </div>
            </div>
        </section>
    )
}