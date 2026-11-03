import Image from "next/image"
import Link from "next/link"

export default function About() {
    return (
        <div className="flex flex-col">
            <section id="hero" className="relative flex h-[calc(100vh-100px)] md:h-[calc(100vh-124px)] overflow-hidden">
                <Image
                    src="/assets/featured/tiguan.webp"
                    alt="Volkswagen Tiguan"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-[70%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#151623]/85 via-[#151623]/50 to-transparent" />
                <div className="relative z-10 flex items-center justify-center md:justify-start w-full px-6 md:px-12 lg:px-20">
                    <div className="max-w-160 flex flex-col items-center md:items-start gap-3 md:gap-5 text-center md:text-start drop-shadow-[0_2px_15px_rgba(0,0,0,0.75)]">
                        <h1 className="text-[clamp(2rem,5vw,4rem)] vw-font text-[var(--white-text)] leading-none">
                            Mais de 70 anos movendo o <span className="font-semibold">Brasil</span>
                        </h1>
                        <h2 className="text-[clamp(1rem,2.2vw,1.5rem)] vw-font text-[var(--white-text)] leading-tight">
                            Tecnologia alemã, paixão brasileira e um compromisso com quem está ao volante.
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <Link href="/build-your-model" className="px-8 py-2 rounded-2xl text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] active:scale-95 transition-normal">
                                Conheça os modelos
                            </Link>
                            <Link href="/dealers" className="px-8 py-2 rounded-2xl text-[var(--white-text)] border-2 border-[var(--white-text)] hover:bg-[var(--white-text)] hover:text-[var(--black-text)] active:scale-95 transition-normal">
                                Encontre uma concessionária
                            </Link>
                        </div>
                    </div>
                </div>
                <a href="#content" aria-label="Rolar para baixo" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[var(--white-text)] animate-bounce">
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </a>
            </section>
            <div id="content" />
        </div>
    )
}