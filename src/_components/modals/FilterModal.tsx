"use client"

import FilterButton from "@/_components/ui/FilterButton"

type Filters = {
    fuel: string[]
    transmission: string[]
}

type Props = {
    open: boolean
    onClose: () => void
    filters: Filters
    toggleFilter: (type: "fuel" | "transmission", value: string) => void
    isActive: (type: "fuel" | "transmission", value: string) => boolean
    clearFilters: () => void
}

export default function FilterModal({
    open,
    onClose,
    toggleFilter,
    isActive,
    clearFilters
}: Props) {

    return (
        <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center transition-normal ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div onClick={(e) => e.stopPropagation()} className={`relative w-full lg:max-w-xl bg-[var(--white-background)] rounded-3xl p-6 flex flex-col gap-2 z-51 transition-normal ${open ? "scale-100" : "scale-95"}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Filtros</h2>
                    <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-normal active:scale-95 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm opacity-70">Combustível</h3>
                    <div className="flex gap-2.5 flex-wrap">
                        <FilterButton
                            label="Flex"
                            active={isActive("fuel", "flex")}
                            onClick={() => toggleFilter("fuel", "flex")}
                        />
                        <FilterButton
                            label="Elétrico"
                            active={isActive("fuel", "electric")}
                            onClick={() => toggleFilter("fuel", "electric")}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm opacity-70">Transmissão</h3>
                    <div className="flex gap-2.5 flex-wrap">
                        <FilterButton
                            label="Manual"
                            active={isActive("transmission", "manual")}
                            onClick={() => toggleFilter("transmission", "manual")}
                        />
                        <FilterButton
                            label="Automático"
                            active={isActive("transmission", "automatic")}
                            onClick={() => toggleFilter("transmission", "automatic")}
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 border-2 border-[var(--white-border)] hover:border-[var(--white-border-hover)] rounded-xl transition-normal active:scale-95 cursor-pointer"
                    >
                        Aplicar
                    </button>

                    <button
                        onClick={clearFilters}
                        className="flex-1 py-2 border-2 border-[var(--white-border)] hover:border-[var(--white-border-hover)] rounded-xl opacity-75 hover:opacity-100 transition-normal active:scale-95 cursor-pointer"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </div>
    )
}