"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import { interpolate } from "@/_lib/i18n/translations"
import { api, formatBRL } from "@/_lib/utils/apiClient"
import SeeTechnicalDataModal, { type TechnicalDataView } from "@/_components/modals/SeeTechnicalDataModal"
import ContactDealerModal from "@/_components/modals/ContactDealerModal"

export type ColorOption = {
    id: string
    name: string
    hexCode: string
    price: number
    imageUrl: string | null
    isDefault: boolean
}

export type WheelOption = {
    id: string
    name: string
    sizeInch: number
    price: number
    imageUrl: string | null
    isDefault: boolean
}

export type SeatOption = {
    id: string
    name: string
    material: string | null
    price: number
    imageUrl: string | null
    isDefault: boolean
}

export type TechnologyOption = {
    id: string
    name: string
    description: string | null
    price: number
}

export type ConfiguratorCar = {
    id: string
    slug: string
    name: string
    tagline: string | null
    year: number
    basePrice: number
    imageUrl: string | null
    interiorImageUrl: string | null
    colors: ColorOption[]
    wheels: WheelOption[]
    seats: SeatOption[]
    technologies: TechnologyOption[]
    technicalData: TechnicalDataView | null
}

type SectionId = "colors" | "wheels" | "seats" | "technology"

type Feedback = { type: "success" | "error"; message: string } | null

function defaultOf<T extends { id: string; isDefault: boolean }>(options: T[]): string | undefined {
    return (options.find((option) => option.isDefault) ?? options[0])?.id
}

function priceLabel(price: number, includedLabel: string): string {
    return price > 0 ? `+ ${formatBRL(price)}` : includedLabel
}

export default function Configurator({ car }: { car: ConfiguratorCar }) {
    const { t } = useLanguage()
    const router = useRouter()
    const pathname = usePathname()

    const [isTechnicalDataOpen, setIsTechnicalDataOpen] = useState(false)
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [isInteriorView, setIsInteriorView] = useState(false)

    const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
        colors: true,
        wheels: false,
        seats: false,
        technology: false,
    })

    const [colorId, setColorId] = useState(() => defaultOf(car.colors))
    const [wheelId, setWheelId] = useState(() => defaultOf(car.wheels))
    const [seatId, setSeatId] = useState(() => defaultOf(car.seats))
    const [techIds, setTechIds] = useState<string[]>([])

    const [savedCode, setSavedCode] = useState<string | null>(null)
    const [pendingAction, setPendingAction] = useState<"save" | "code" | null>(null)
    const [feedback, setFeedback] = useState<Feedback>(null)

    const color = car.colors.find((option) => option.id === colorId)
    const wheel = car.wheels.find((option) => option.id === wheelId)
    const seat = car.seats.find((option) => option.id === seatId)
    const technologies = useMemo(
        () => car.technologies.filter((option) => techIds.includes(option.id)),
        [car.technologies, techIds]
    )

    const totalPrice =
        car.basePrice +
        (color?.price ?? 0) +
        (wheel?.price ?? 0) +
        (seat?.price ?? 0) +
        technologies.reduce((sum, option) => sum + option.price, 0)

    // Uma configuração salva deixa de valer assim que o usuário muda
    // qualquer opção, para que o código sempre reflita o que está na tela.
    function onSelectionChange() {
        setSavedCode(null)
        setFeedback(null)
    }

    function toggleSection(section: SectionId) {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    function selectColor(id: string) {
        setColorId(id)
        onSelectionChange()
    }

    function selectWheel(id: string) {
        setWheelId(id)
        onSelectionChange()
    }

    function selectSeat(id: string) {
        setSeatId(id)
        onSelectionChange()
    }

    function toggleTechnology(id: string) {
        setTechIds((prev) => (prev.includes(id) ? prev.filter((techId) => techId !== id) : [...prev, id]))
        onSelectionChange()
    }

    function resetSelection() {
        setColorId(defaultOf(car.colors))
        setWheelId(defaultOf(car.wheels))
        setSeatId(defaultOf(car.seats))
        setTechIds([])
        onSelectionChange()
    }

    async function persistConfiguration(): Promise<string | null> {
        const res = await api.post<{ code: string; totalPrice: string }>("/api/configurations", {
            carId: car.id,
            ...(colorId ? { colorId } : {}),
            ...(wheelId ? { wheelId } : {}),
            ...(seatId ? { seatId } : {}),
            techIds,
        })

        if (res.status === 401) {
            router.push(`/login?next=${encodeURIComponent(pathname)}`)
            return null
        }

        if (!res.ok || !res.data) {
            setFeedback({ type: "error", message: res.error ?? t.setting.saveError })
            return null
        }

        setSavedCode(res.data.code)
        return res.data.code
    }

    async function handleSave() {
        setPendingAction("save")
        setFeedback(null)

        const code = await persistConfiguration()
        if (code) {
            setFeedback({ type: "success", message: interpolate(t.setting.savedWithCode, { code }) })
        }

        setPendingAction(null)
    }

    async function handleCreateCode() {
        setPendingAction("code")
        setFeedback(null)

        const code = savedCode ?? (await persistConfiguration())
        if (!code) {
            setPendingAction(null)
            return
        }

        try {
            await navigator.clipboard.writeText(code)
            setFeedback({ type: "success", message: interpolate(t.setting.codeCopied, { code }) })
        } catch {
            setFeedback({ type: "success", message: interpolate(t.setting.codeCreated, { code }) })
        }

        setPendingAction(null)
    }

    const exteriorUrl = color?.imageUrl ?? car.imageUrl
    // Fotos específicas de cor preenchem o canvas; a foto de catálogo do
    // modelo (fundo transparente) fica melhor contida sobre o gradiente.
    const isCatalogShot = !color?.imageUrl || color.imageUrl === car.imageUrl
    const interiorUrl = car.interiorImageUrl ?? seat?.imageUrl ?? exteriorUrl
    const hasInteriorView = Boolean(car.interiorImageUrl)

    return (
        <div className="flex flex-col gap-2 px-6 py-6">
            <nav className="flex flex-row items-center gap-x-1.5 text-sm sm:text-base flex-wrap">
                <Link href="/">{t.nav.home}</Link>
                <span>/</span>
                <Link href="/build-your-model">{t.setting.models}</Link>
                <span>/</span>
                <span className="font-medium truncate">{car.name}</span>
            </nav>
            <div className="flex flex-col lg:flex-row gap-8">
                <div id="canvas" className="h-full max-h-250 w-full lg:w-[65%] relative lg:sticky lg:top-6 lg:self-start">
                    <div className="relative min-h-100 max-h-200 h-150 w-full rounded-xl overflow-hidden bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)]">
                        {exteriorUrl && (
                            <Image
                                src={exteriorUrl}
                                alt={interpolate(t.setting.exteriorAlt, { car: car.name, color: color?.name ?? "" })}
                                className={`transition-normal ${isCatalogShot ? "object-contain p-6" : "object-cover"} ${isInteriorView ? "opacity-0" : "opacity-100"}`}
                                sizes="(max-width: 1024px) 100vw, 65vw"
                                draggable="false"
                                priority
                                fill
                            />
                        )}
                        {hasInteriorView && interiorUrl && (
                            <Image
                                src={interiorUrl}
                                alt={interpolate(t.setting.interiorAlt, { car: car.name })}
                                className={`object-cover transition-normal ${isInteriorView ? "opacity-100" : "opacity-0"}`}
                                sizes="(max-width: 1024px) 100vw, 65vw"
                                draggable="false"
                                fill
                            />
                        )}
                    </div>
                    {hasInteriorView && (
                        <button
                            onClick={() => setIsInteriorView((prev) => !prev)}
                            aria-label={isInteriorView ? t.setting.viewExterior : t.setting.viewInterior}
                            className="absolute bottom-4 left-4 px-3 py-2 bg-[var(--dark-blue)] text-[var(--white-text)] rounded-xl hover:bg-[var(--medium-blue)] transition-normal active:scale-95 cursor-pointer z-10"
                        >
                            {isInteriorView ?
                                <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>
                                    </svg>
                                </> : <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/>
                                    </svg>
                                </>
                            }
                        </button>
                    )}
                    {color && (
                        <div className="absolute bottom-4 right-4 flex flex-row items-center gap-2 px-3 py-2 bg-[var(--white-background)]/85 rounded-xl z-10">
                            <span className="size-4 rounded-full border border-black/20" style={{ backgroundColor: color.hexCode }} />
                            <span className="text-sm">{color.name}</span>
                        </div>
                    )}
                </div>
                <div className="h-full w-full lg:w-[35%] gap-5 overflow-y-auto overflow-x-hidden flex flex-col">
                    <div className="flex flex-row items-center justify-between gap-1">
                        <div>
                            <h1 className="text-2xl lg:text-3xl vw-font font-semibold">{car.name}</h1>
                            <span className="text-xl font-semibold">{car.tagline ?? car.year}</span>
                        </div>
                        {car.technicalData && (
                            <button onClick={() => setIsTechnicalDataOpen(true)} className="px-3 py-1 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:scale-95 cursor-pointer">
                                {t.setting.technicalData}
                            </button>
                        )}
                    </div>
                    <section className="flex flex-col gap-3">
                        {car.colors.length > 0 && (
                            <Section id="colors" title={t.setting.colors} summary={color?.name} open={openSections.colors} onToggle={toggleSection}>
                                <div className="flex flex-col gap-2">
                                    {car.colors.map((option) => (
                                        <OptionRow
                                            key={option.id}
                                            selected={option.id === colorId}
                                            onSelect={() => selectColor(option.id)}
                                            title={option.name}
                                            price={option.price}
                                            includedLabel={t.setting.included}
                                            leading={<span className="size-7 shrink-0 rounded-full border border-black/20" style={{ backgroundColor: option.hexCode }} />}
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}
                        {car.wheels.length > 0 && (
                            <Section id="wheels" title={t.setting.wheels} summary={wheel?.name} open={openSections.wheels} onToggle={toggleSection}>
                                <div className="flex flex-col gap-2">
                                    {car.wheels.map((option) => (
                                        <OptionRow
                                            key={option.id}
                                            selected={option.id === wheelId}
                                            onSelect={() => selectWheel(option.id)}
                                            title={option.name}
                                            description={`${t.setting.rim} ${option.sizeInch}"`}
                                            price={option.price}
                                            includedLabel={t.setting.included}
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}
                        {car.seats.length > 0 && (
                            <Section id="seats" title={t.setting.seats} summary={seat?.name} open={openSections.seats} onToggle={toggleSection}>
                                <div className="flex flex-col gap-2">
                                    {car.seats.map((option) => (
                                        <OptionRow
                                            key={option.id}
                                            selected={option.id === seatId}
                                            onSelect={() => selectSeat(option.id)}
                                            title={option.name}
                                            description={option.material}
                                            price={option.price}
                                            includedLabel={t.setting.included}
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}
                        {car.technologies.length > 0 && (
                            <Section
                                id="technology"
                                title={t.setting.technology}
                                summary={technologies.length ? interpolate(t.setting.selectedCount, { count: technologies.length }) : undefined}
                                open={openSections.technology}
                                onToggle={toggleSection}
                            >
                                <div className="flex flex-col gap-2">
                                    {car.technologies.map((option) => (
                                        <OptionRow
                                            key={option.id}
                                            selected={techIds.includes(option.id)}
                                            onSelect={() => toggleTechnology(option.id)}
                                            title={option.name}
                                            description={option.description}
                                            price={option.price}
                                            includedLabel={t.setting.included}
                                            multiple
                                        />
                                    ))}
                                </div>
                            </Section>
                        )}
                    </section>
                    <section className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">{t.setting.basePrice}</span>
                                <span className="leading-tight">{formatBRL(car.basePrice)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">{t.setting.customizedPrice}</span>
                                <div className="relative h-7 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={totalPrice}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute leading-tight"
                                        >
                                            {formatBRL(totalPrice)}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                            <button onClick={resetSelection} className="w-fit text-sm underline opacity-70 hover:opacity-100 transition-normal cursor-pointer">
                                {t.setting.restart}
                            </button>
                        </div>
                        {feedback && (
                            <p role="status" className={`text-sm ${feedback.type === "error" ? "text-red-700" : "text-[var(--dark-blue)]"}`}>
                                {feedback.message}
                            </p>
                        )}
                        <div className="flex flex-col gap-2.5">
                            <button onClick={() => setIsContactOpen(true)} className="text-base md:text-lg px-5 py-3 bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] rounded-2xl transition-normal active:scale-95 cursor-pointer">
                                {t.setting.contactDealer}
                            </button>
                            <div className="flex flex-col md:flex-row gap-2.5">
                                <button onClick={handleSave} disabled={pendingAction !== null} className="text-base md:text-lg flex-1 px-5 py-3 bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] rounded-2xl transition-normal active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    {pendingAction === "save" ? t.setting.saving : t.setting.save}
                                </button>
                                <button onClick={handleCreateCode} disabled={pendingAction !== null} className="text-base md:text-lg flex-1 px-5 py-3 bg-[var(--white-background)] border-2 rounded-2xl transition-normal active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    {pendingAction === "code" ? t.setting.generating : savedCode ?? t.setting.createCode}
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm">{t.setting.priceDisclaimer}</p>
                        </div>
                    </section>
                </div>
            </div>
            <SeeTechnicalDataModal
                open={isTechnicalDataOpen}
                onClose={() => setIsTechnicalDataOpen(false)}
                carName={car.name}
                data={car.technicalData}
            />
            <ContactDealerModal
                open={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                carId={car.id}
                carName={car.name}
                configurationCode={savedCode}
                totalPrice={totalPrice}
            />
        </div>
    )
}

type SectionProps = {
    id: SectionId
    title: string
    summary?: string
    open: boolean
    onToggle: (id: SectionId) => void
    children: React.ReactNode
}

function Section({ id, title, summary, open, onToggle, children }: SectionProps) {
    return (
        <div id={id} className="flex flex-col">
            <button onClick={() => onToggle(id)} aria-expanded={open} className="group flex flex-row items-center justify-between gap-2 text-left cursor-pointer">
                <div className="flex flex-col">
                    <h2 className="text-lg group-hover:ml-1.5 transition-normal">{title}</h2>
                    {summary && <span className="text-sm opacity-70 group-hover:ml-1.5 transition-normal">{summary}</span>}
                </div>
                <div className="relative size-[22px]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}>
                        <path d="M5 12h14"/><path d="M12 5v14"/>
                    </svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                        <path d="M5 12h14"/>
                    </svg>
                </div>
            </button>
            <div className={`overflow-hidden transition-normal ${open ? "max-h-200 mt-2" : "max-h-0"}`}>
                {children}
            </div>
        </div>
    )
}

type OptionRowProps = {
    selected: boolean
    onSelect: () => void
    title: string
    description?: string | null
    price: number
    includedLabel: string
    leading?: React.ReactNode
    multiple?: boolean
}

function OptionRow({ selected, onSelect, title, description, price, includedLabel, leading, multiple }: OptionRowProps) {
    return (
        <button
            onClick={onSelect}
            role={multiple ? "checkbox" : "radio"}
            aria-checked={selected}
            className={`flex flex-row items-center gap-3 w-full text-left px-3 py-2.5 border-2 rounded-2xl transition-normal cursor-pointer ${
                selected
                    ? "border-[var(--dark-blue)] bg-[var(--white-border)]/20"
                    : "border-[var(--white-border)] hover:bg-[var(--white-border)]/15"
            }`}
        >
            {leading}
            <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate">{title}</span>
                {description && <span className="text-sm opacity-70">{description}</span>}
            </div>
            <span className="text-sm whitespace-nowrap opacity-80">{priceLabel(price, includedLabel)}</span>
            <div className={`relative size-[18px] shrink-0 ${multiple ? "" : "rounded-full"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${selected ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                    <path d="M20 6 9 17l-5-5"/>
                </svg>
            </div>
        </button>
    )
}