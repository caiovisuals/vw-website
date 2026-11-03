"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { galleryCategories, galleryPhotos, gallerySrc, type GalleryCategory } from "@/_components/gallery/galleryData"

export default function Gallery() {
    const [category, setCategory] = useState<GalleryCategory | null>(null)
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const photos = useMemo(
        () => galleryPhotos.filter((photo) => !category || photo.category === category),
        [category]
    )

    const close = useCallback(() => setOpenIndex(null), [])
    const prev = useCallback(() => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)), [photos.length])
    const next = useCallback(() => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)), [photos.length])

    useEffect(() => {
        if (openIndex === null) return

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close()
            if (e.key === "ArrowLeft") prev()
            if (e.key === "ArrowRight") next()
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", handleKey)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", handleKey)
        }
    }, [openIndex, close, prev, next])

    const current = openIndex !== null ? photos[openIndex] : null

    return (
        <div className="flex flex-col items-center gap-5 py-6 md:py-10 lg:py-15 xl:py-20 px-4 md:px-10 lg:px-15 xl:px-20">
            <div id="header" className="w-full max-w-400 pt-8 sm:pt-10 md:pt-12 lg:pt-16 px-2 md:px-0">
                <h1 className="text-2xl lg:text-3xl font-semibold vw-font">Galeria <span className="font-semibold">Volkswagen</span></h1>
                <h3 className="text-xl vw-font">Detalhes, design e momentos que inspiram</h3>
            </div>
            <div role="tablist" aria-label="Filtrar fotos" className="w-full max-w-400 flex flex-row gap-2 overflow-x-auto hide-scrollbar px-2 md:px-0">
                {galleryCategories.map((item) => {
                    const active = category === item.value
                    return (
                        <button
                            key={item.label}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setCategory(item.value)}
                            className={`flex-shrink-0 px-5 py-1.5 rounded-2xl border-2 transition-normal cursor-pointer active:scale-95 ${
                                active
                                    ? "bg-[var(--dark-blue)] border-[var(--dark-blue)] text-[var(--white-text)]"
                                    : "border-[var(--black-text)]/15 hover:border-[var(--dark-blue)] hover:text-[var(--dark-blue)]"
                            }`}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </div>
            <section id="gallery" className="w-full max-w-400 columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4">
                {photos.map((photo, index) => (
                    <button
                        key={photo.file}
                        onClick={() => setOpenIndex(index)}
                        aria-label={`Abrir foto: ${photo.alt}`}
                        className="group relative block w-full mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-[#e5e5e5] cursor-zoom-in"
                    >
                        <Image
                            src={gallerySrc(photo.file)}
                            alt={photo.alt}
                            width={photo.width}
                            height={photo.height}
                            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            className="w-full h-auto group-hover:scale-105 transition-normal select-none"
                            draggable="false"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#151623]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-normal">
                            <span className="p-3 md:p-4 text-sm md:text-base text-left text-[var(--white-text)] font-semibold">{photo.alt}</span>
                        </div>
                    </button>
                ))}
            </section>
            <AnimatePresence>
                {current && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={current.alt}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151623]/90 backdrop-blur-sm p-4 md:p-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                    >
                        <button onClick={close} aria-label="Fechar" className="absolute top-4 right-4 p-2 rounded-full text-[var(--white-text)] hover:bg-[var(--white-text)]/15 transition-normal cursor-pointer">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Foto anterior" className="absolute left-2 md:left-6 p-2 rounded-full text-[var(--white-text)] hover:bg-[var(--white-text)]/15 transition-normal cursor-pointer">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); next() }} aria-label="Próxima foto" className="absolute right-2 md:right-6 p-2 rounded-full text-[var(--white-text)] hover:bg-[var(--white-text)]/15 transition-normal cursor-pointer">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                        <motion.figure
                            key={current.file}
                            className="flex flex-col items-center gap-3 max-w-full"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={gallerySrc(current.file)}
                                alt={current.alt}
                                width={current.width}
                                height={current.height}
                                sizes="90vw"
                                className="w-auto h-auto max-w-[80vw] max-h-[80vh] rounded-xl object-contain"
                                priority
                            />
                            <figcaption className="text-[var(--white-text)] text-sm md:text-base">
                                {current.alt} <span className="text-[var(--white-text-hover)]">· {openIndex! + 1} / {photos.length}</span>
                            </figcaption>
                        </motion.figure>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}