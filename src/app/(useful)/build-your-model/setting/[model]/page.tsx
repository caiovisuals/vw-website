import { notFound } from "next/navigation"
import { cache } from "react"
import type { Metadata } from "next"
import { prisma } from "@/_lib/prisma"
import Configurator, { type ConfiguratorCar } from "@/_components/setting/Configurator"

type Params = { params: Promise<{ model: string }> }

const getCar = cache(async (slug: string) => {
    return prisma.car.findUnique({
        where: { slug, isActive: true },
        include: {
            colors: { orderBy: [{ isDefault: "desc" }, { price: "asc" }] },
            wheels: { orderBy: [{ isDefault: "desc" }, { price: "asc" }] },
            seats: { orderBy: [{ isDefault: "desc" }, { price: "asc" }] },
            technologies: { orderBy: [{ price: "asc" }, { name: "asc" }] },
            technicalData: true,
        },
    })
})

type CarWithOptions = NonNullable<Awaited<ReturnType<typeof getCar>>>

// O Prisma devolve preços como Decimal, que não atravessa a fronteira
// servidor → cliente. Por isso a configuração é serializada antes de ir
// para o componente interativo.
function toConfiguratorCar(car: CarWithOptions): ConfiguratorCar {
    return {
        id: car.id,
        slug: car.slug,
        name: car.name,
        tagline: car.tagline,
        year: car.year,
        basePrice: Number(car.basePrice),
        imageUrl: car.imageUrl,
        interiorImageUrl: car.interiorImageUrl,
        colors: car.colors.map((color) => ({
            id: color.id,
            name: color.name,
            hexCode: color.hexCode,
            price: Number(color.price),
            imageUrl: color.imageUrl,
            isDefault: color.isDefault,
        })),
        wheels: car.wheels.map((wheel) => ({
            id: wheel.id,
            name: wheel.name,
            sizeInch: wheel.sizeInch,
            price: Number(wheel.price),
            imageUrl: wheel.imageUrl,
            isDefault: wheel.isDefault,
        })),
        seats: car.seats.map((seat) => ({
            id: seat.id,
            name: seat.name,
            material: seat.material,
            price: Number(seat.price),
            imageUrl: seat.imageUrl,
            isDefault: seat.isDefault,
        })),
        technologies: car.technologies.map((tech) => ({
            id: tech.id,
            name: tech.name,
            description: tech.description,
            price: Number(tech.price),
        })),
        technicalData: car.technicalData
            ? {
                engineDisplacement: car.technicalData.engineDisplacement,
                enginePower: car.technicalData.enginePower,
                engineTorque: car.technicalData.engineTorque,
                acceleration0to100: car.technicalData.acceleration0to100,
                topSpeed: car.technicalData.topSpeed,
                fuelConsumptionCity: car.technicalData.fuelConsumptionCity,
                fuelConsumptionHwy: car.technicalData.fuelConsumptionHwy,
                tankCapacity: car.technicalData.tankCapacity,
                wheelbase: car.technicalData.wheelbase,
                length: car.technicalData.length,
                width: car.technicalData.width,
                height: car.technicalData.height,
                curbWeight: car.technicalData.curbWeight,
                cargoVolume: car.technicalData.cargoVolume,
                frontSuspension: car.technicalData.frontSuspension,
                rearSuspension: car.technicalData.rearSuspension,
                brakes: car.technicalData.brakes,
            }
            : null,
    }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { model } = await params
    const car = await getCar(model)

    if (!car) return { title: "Modelo não encontrado" }

    return {
        title: `Monte seu ${car.name} | Volkswagen do Brasil`,
        description: car.tagline ?? `Configure cores, rodas, bancos e tecnologia do seu ${car.name}.`,
    }
}

export default async function Setting({ params }: Params) {
    const { model } = await params
    const car = await getCar(model)

    if (!car) notFound()

    return <Configurator car={toConfiguratorCar(car)} />
}