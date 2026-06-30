import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"
import type { Metadata } from "next"
import { prisma } from "@/_lib/prisma"

type Params = { params: Promise<{ slug: string }> }

const getCar = cache(async (slug: string) => {
    return prisma.car.findUnique({
        where: { slug, isActive: true },
        select: {
            slug: true,
            name: true,
            tagline: true,
            description: true,
            imageUrl: true,
        },
    })
})

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params
    const car = await getCar(slug)

    if (!car) return { title: "Modelo não encontrado" }

    return {
        title: `${car.name} | Volkswagen`,
        description: car.tagline ?? car.description ?? `Conheça o ${car.name}.`,
    }
}

export default async function Car({ params }: Params) {
    const { slug } = await params
    const car = await getCar(slug)

    if (!car) notFound()

    const bannerUrl = car.imageUrl ?? `/assets/cars/${car.slug}/banner.webp`

    return (
        <div className="flex flex-col">
            <div id="banner" className="relative w-full h-120 max-h-300">
                <Image src={bannerUrl} alt={car.name} className="size-full object-cover" fill />
            </div>
            <div className="flex flex-col py-6 md:py-10 lg:py-15 xl:py-20 px-6 md:px-10 lg:px-15 xl:px-20">
                <div id="header" className="flex flex-row items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold vw-font">Conheça o Novo {car.name}</h1>
                        {car.tagline && <h2 className="text-xl vw-font">{car.tagline}</h2>}
                    </div>
                    <div>
                        <Link href={`/build-your-model/setting?model=${car.slug}`} className="px-8 py-2 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:95">
                            Tenho Interesse
                        </Link>
                    </div>
                </div>
                <section></section>
            </div>
        </div>
    )
}