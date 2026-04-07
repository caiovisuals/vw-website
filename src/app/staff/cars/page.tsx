"use client"

import { useEffect, useState, useCallback } from "react"

type FuelType = "FLEX" | "ELECTRIC" | "HYBRID" | "GASOLINE" | "DIESEL"
type TransmissionType = "MANUAL" | "AUTOMATIC" | "CVT"

interface Car {
    id: string; slug: string; name: string; tagline: string | null
    basePrice: string; fuel: FuelType; transmission: TransmissionType
    isElectric: boolean; isFeatured: boolean; isActive: boolean
    year: number; imageUrl: string | null
}

const FUEL_LABEL: Record<FuelType, string> = {
    FLEX: "Flex", ELECTRIC: "Elétrico", HYBRID: "Híbrido", GASOLINE: "Gasolina", DIESEL: "Diesel",
}
const TRANS_LABEL: Record<TransmissionType, string> = {
    MANUAL: "Manual", AUTOMATIC: "Automático", CVT: "CVT",
}

const emptyForm = {
    slug: "", name: "", tagline: "", description: "", basePrice: "",
    fuel: "FLEX" as FuelType, transmission: "AUTOMATIC" as TransmissionType,
    isElectric: false, isFeatured: false, year: new Date().getFullYear(),
    imageUrl: "", interiorImageUrl: "",
}

export default function StaffCars() {
    const [cars, setCars] = useState<Car[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ ...emptyForm })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const fetchCars = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/cars?limit=50", { credentials: "include" })
            const json = await res.json()
            if (json.success) setCars(json.data.cars)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { fetchCars() }, [fetchCars])

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setFormError(null)
        setFormSuccess(null)
        setFormLoading(true)
        try {
            const payload = {
                ...form,
                basePrice: parseFloat(form.basePrice),
                year: Number(form.year),
                tagline: form.tagline || undefined,
                imageUrl: form.imageUrl || undefined,
                interiorImageUrl: form.interiorImageUrl || undefined,
            }
            const res = await fetch("/api/cars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            })
            const json = await res.json()
            if (res.ok) {
                setFormSuccess("Carro cadastrado com sucesso!")
                setForm({ ...emptyForm })
                setShowForm(false)
                fetchCars()
            } else {
                setFormError(json.error ?? "Erro ao cadastrar carro.")
            }
        } finally {
            setFormLoading(false)
        }
    }

    async function toggleActive(slug: string, current: boolean) {
        await fetch(`/api/cars/${slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ isActive: !current }),
        })
        setCars(prev => prev.map(c => c.slug === slug ? { ...c, isActive: !current } : c))
    }

    async function toggleFeatured(slug: string, current: boolean) {
        await fetch(`/api/cars/${slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ isFeatured: !current }),
        })
        setCars(prev => prev.map(c => c.slug === slug ? { ...c, isFeatured: !current } : c))
    }

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold vw-font">Carros</h1>
                    <p className="text-sm text-[var(--black-text-hover)]">{cars.length} modelos cadastrados</p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal flex-shrink-0"
                >
                    {showForm ? "Cancelar" : "+ Novo Carro"}
                </button>
            </div>

            {formSuccess && (
                <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                    {formSuccess}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white rounded-xl border border-[var(--white-border)]/30 p-5 flex flex-col gap-4">
                    <h2 className="font-semibold text-sm">Cadastrar novo modelo</h2>
                    {formError && (
                        <p className="text-red-600 text-sm">{formError}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { key: "name", label: "Nome", placeholder: "Ex: Jetta" },
                            { key: "slug", label: "Slug", placeholder: "ex: jetta-gli" },
                            { key: "tagline", label: "Tagline", placeholder: "Ex: O sedan perfeito" },
                            { key: "basePrice", label: "Preço base (R$)", placeholder: "280000" },
                            { key: "year", label: "Ano", placeholder: String(new Date().getFullYear()) },
                            { key: "imageUrl", label: "URL da imagem", placeholder: "https://..." },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key} className="flex flex-col gap-1">
                                <label className="text-xs text-[var(--black-text-hover)]">{label}</label>
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    value={(form as Record<string, unknown>)[key] as string}
                                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none focus:border-[var(--dark-blue)] transition-normal"
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--black-text-hover)]">Combustível</label>
                            <select
                                value={form.fuel}
                                onChange={e => setForm(prev => ({ ...prev, fuel: e.target.value as FuelType }))}
                                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none bg-white transition-normal"
                            >
                                {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--black-text-hover)]">Transmissão</label>
                            <select
                                value={form.transmission}
                                onChange={e => setForm(prev => ({ ...prev, transmission: e.target.value as TransmissionType }))}
                                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none bg-white transition-normal"
                            >
                                {Object.entries(TRANS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={form.isElectric} onChange={e => setForm(prev => ({ ...prev, isElectric: e.target.checked }))} className="rounded" />
                            Elétrico
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))} className="rounded" />
                            Em Destaque
                        </label>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="px-6 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal disabled:opacity-60"
                        >
                            {formLoading ? "Salvando..." : "Cadastrar Modelo"}
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl border border-[var(--white-border)]/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--white-border)]/20 text-left">
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Modelo</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Preço</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden md:table-cell">Combustível</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden lg:table-cell">Transmissão</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Status</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--white-border)]/10">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">Carregando...</td></tr>
                            ) : cars.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">Nenhum carro cadastrado.</td></tr>
                            ) : cars.map(car => (
                                <tr key={car.id} className="hover:bg-[#f9f9f8] transition-fast">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{car.name}</p>
                                        <p className="text-xs text-[var(--black-text-hover)]">{car.tagline ?? car.slug} · {car.year}</p>
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {Number(car.basePrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </td>
                                    <td className="px-4 py-3 text-xs hidden md:table-cell">{FUEL_LABEL[car.fuel]}</td>
                                    <td className="px-4 py-3 text-xs hidden lg:table-cell">{TRANS_LABEL[car.transmission]}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${car.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {car.isActive ? "Ativo" : "Inativo"}
                                            </span>
                                            {car.isFeatured && (
                                                <span className="text-xs px-2 py-0.5 rounded-full w-fit font-medium bg-amber-100 text-amber-700">
                                                    Destaque
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => toggleActive(car.slug, car.isActive)} className="text-xs text-[var(--dark-blue)] hover:underline text-left">
                                                {car.isActive ? "Desativar" : "Ativar"}
                                            </button>
                                            <button onClick={() => toggleFeatured(car.slug, car.isFeatured)} className="text-xs text-[var(--dark-blue)] hover:underline text-left">
                                                {car.isFeatured ? "Tirar Destaque" : "Destacar"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}