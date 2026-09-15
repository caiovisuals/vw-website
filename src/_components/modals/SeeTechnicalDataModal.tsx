"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"
import { interpolate } from "@/_lib/i18n/translations"

export type TechnicalDataView = {
    engineDisplacement: string | null
    enginePower: string | null
    engineTorque: string | null
    acceleration0to100: string | null
    topSpeed: string | null
    fuelConsumptionCity: string | null
    fuelConsumptionHwy: string | null
    tankCapacity: string | null
    wheelbase: string | null
    length: string | null
    width: string | null
    height: string | null
    curbWeight: string | null
    cargoVolume: string | null
    frontSuspension: string | null
    rearSuspension: string | null
    brakes: string | null
}

type Props = {
    open: boolean
    onClose: () => void
    carName: string
    data: TechnicalDataView | null
}

type GroupId = "engine" | "consumption" | "dimensions" | "suspension"

const groups: { id: GroupId; keys: (keyof TechnicalDataView)[] }[] = [
    {
        id: "engine",
        keys: ["engineDisplacement", "enginePower", "engineTorque", "acceleration0to100", "topSpeed"],
    },
    {
        id: "consumption",
        keys: ["fuelConsumptionCity", "fuelConsumptionHwy", "tankCapacity"],
    },
    {
        id: "dimensions",
        keys: ["wheelbase", "length", "width", "height", "curbWeight", "cargoVolume"],
    },
    {
        id: "suspension",
        keys: ["frontSuspension", "rearSuspension", "brakes"],
    },
]

export default function SeeTechnicalDataModal({
    open,
    onClose,
    carName,
    data,
}: Props) {
    const { t } = useLanguage()
    const filledGroups = data
        ? groups
            .map((group) => ({ ...group, keys: group.keys.filter((key) => data[key]) }))
            .filter((group) => group.keys.length > 0)
        : []

    return (
        <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-normal ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div onClick={(e) => e.stopPropagation()} className={`relative w-full lg:max-w-xl max-h-[85vh] overflow-y-auto bg-[var(--white-background)] rounded-3xl p-6 flex flex-col gap-2 z-51 transition-normal ${open ? "scale-100" : "scale-95"}`}>
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold">{interpolate(t.setting.technicalDataTitle, { car: carName })}</h2>
                    <button onClick={onClose} aria-label={t.setting.close} className="opacity-50 hover:opacity-100 transition-normal active:scale-95 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                {filledGroups.length === 0 ? (
                    <p className="opacity-70">{t.setting.technicalDataEmpty}</p>
                ) : (
                    filledGroups.map((group) => (
                        <div key={group.id} className="flex flex-col gap-1">
                            <span className="text-lg font-semibold">{t.setting.technicalDataGroups[group.id]}</span>
                            <dl className="flex flex-col">
                                {group.keys.map((key) => (
                                    <div key={key} className="flex flex-row items-baseline justify-between gap-4 py-1 border-b border-[var(--white-border)] last:border-b-0">
                                        <dt className="text-sm opacity-70">{t.setting.technicalDataLabels[key]}</dt>
                                        <dd className="text-right">{data?.[key]}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}