import Image from "next/image"

const stats = [
    { value: "10", label: "marcas no grupo" },
    { value: "+100", label: "fábricas pelo mundo" },
    { value: "+680 mil", label: "colaboradores" },
    { value: "+150", label: "países atendidos" },
]

export default function VolkswagenGroup() {
    return (
        <div className="flex flex-col">
            <section id="hero" className="relative flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-124px)] overflow-hidden">
                <Image
                    src="/assets/cars/jetta/banner.webp"
                    alt="Volkswagen Jetta"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151623]/90 via-[#151623]/45 to-[#151623]/20" />
                <div className="relative z-10 flex flex-1 items-center justify-center px-6 md:px-12 lg:px-20">
                    <div className="max-w-240 flex flex-col items-center gap-3 md:gap-5 text-center drop-shadow-[0_2px_15px_rgba(0,0,0,0.75)]">
                        <h1 className="text-[clamp(2rem,5.5vw,4.5rem)] vw-font text-[var(--white-text)] leading-none">
                            Um dos maiores grupos <span className="font-semibold">automotivos do mundo</span>
                        </h1>
                        <h2 className="text-[clamp(1rem,2.2vw,1.5rem)] vw-font text-[var(--white-text)] leading-tight max-w-160">
                            Marcas icônicas unidas pela inovação, pela engenharia e pela mobilidade do futuro.
                        </h2>
                    </div>
                </div>
                <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-[2px] bg-[var(--white-text)]/15 border-t-2 border-[var(--white-text)]/15 backdrop-blur-sm">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center justify-center gap-1 py-4 md:py-6 bg-[#151623]/60">
                            <span className="text-2xl md:text-4xl vw-font font-semibold text-[var(--white-text)]">
                                {stat.value}
                            </span>
                            <span className="text-xs md:text-sm uppercase tracking-wider text-[var(--white-text-hover)]">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}