import Link from "next/link"
import Image from "next/image"

export default function FeaturedSection() {
    return (
        <section id="featured" className="flex flex-col items-center justify-center gap-16 py-6 md:py-10 lg:py-15 xl:py-20 px-6 md:px-10 lg:px-15 xl:px-20">
            <h2 className="text-center text-4xl vw-font">Modelos em <span className="font-semibold">Destaque</span></h2>
            <div className="w-full flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 md:max-w-7xl xl:max-w-8xl">
                <div className="w-full lg:w-[50%] flex flex-col gap-8">
                    <div>
                        <h3 className="text-3xl vw-font">Novo <span className="font-semibold">Tiguan R-Line</span></h3>
                        <p className="text-lg leading-tight">O SUV à altura da sua história</p>
                    </div>
                    <p>O Novo Tiguan R-Line traduz o encontro entre sofisticação, performance e tecnologia de ponta. Com design marcante, motorização potente e soluções inteligentes de condução e segurança, ele eleva cada trajeto a uma experiência premium — mais fluida, confortável e envolvente.</p>
                    <Link href="/car" className="w-fit px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">
                        Conheça o Novo Tiguan R-Line
                    </Link>
                </div>
                <div className="w-full lg:w-[50%] relative min-h-[300px] lg:min-h-full lg:w-[50rem]">
                    <Image src="/assets/featured/tiguan.webp" alt="Novo Tiguan R-Line" className="w-full object-cover" fill draggable="false" />
                </div>
            </div>
        </section>
    )
}