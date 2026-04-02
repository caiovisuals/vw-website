import Link from "next/link"
import Image from "next/image"

export default function Car() {
    return (
        <div className="flex flex-col">
            <div id="banner" className="relative w-full h-120 max-h-300">
                <Image src="/assets/cars/jetta/banner.webp" alt="Jetta" className="size-full object-cover" fill />
            </div>
            <div className="flex flex-col py-6 md:py-10 lg:py-15 xl:py-20 px-6 md:px-10 lg:px-15 xl:px-20">
                <div id="header" className="flex flex-row items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold vw-font">Conheça o Novo Jetta</h1>
                        <h2 className="text-xl vw-font">O sedan à altura da sua história</h2>
                    </div>
                    <div>
                        <Link href="build-your-model/setting" className="px-8 py-2 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:95">
                            Tenho Interesse
                        </Link>
                    </div>
                </div>
                <section></section>
            </div>
        </div>
    )
}