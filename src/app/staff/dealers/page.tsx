"use client"

import { useEffect, useState, useCallback } from "react"

interface Dealer {
    id: string; name: string; address: string; city: string; state: string
    zip: string | null; phone: string | null; email: string | null
    lat: number | null; lng: number | null; isActive: boolean
    createdAt: string
}

interface Pagination { total: number; page: number; limit: number; pages: number }

const emptyForm = {
    name: "", address: "", city: "", state: "", zip: "", phone: "", email: "",
    lat: "", lng: "",
}

export default function StaffDealers() {
    const [dealers, setDealers] = useState<Dealer[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ ...emptyForm })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)
    const [stateFilter, setStateFilter] = useState("")

    const fetchDealers = useCallback(async () => {
        setIsLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: "20" })
        if (stateFilter) params.set("state", stateFilter)
        try {
            const res = await fetch(`/api/dealers?${params}`, { credentials: "include" })
            const json = await res.json()
            if (json.success) {
                setDealers(json.data.dealers)
                setPagination(json.data.pagination)
            }
        } finally {
            setIsLoading(false)
        }
    }, [page, stateFilter])

    useEffect(() => { fetchDealers() }, [fetchDealers])

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        setFormError(null)
        setFormSuccess(null)
        setFormLoading(true)
        try {
            const payload = {
                ...form,
                lat: form.lat ? parseFloat(form.lat) : undefined,
                lng: form.lng ? parseFloat(form.lng) : undefined,
                zip: form.zip || undefined,
                phone: form.phone || undefined,
                email: form.email || undefined,
            }
            const res = await fetch("/api/dealers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            })
            const json = await res.json()
            if (res.ok) {
                setFormSuccess("Concessionária cadastrada!")
                setForm({ ...emptyForm })
                setShowForm(false)
                fetchDealers()
            } else {
                setFormError(json.error ?? "Erro ao cadastrar.")
            }
        } finally {
            setFormLoading(false)
        }
    }

    async function toggleActive(id: string, current: boolean) {
        await fetch(`/api/dealers/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ isActive: !current }),
        })
        setDealers(prev => prev.map(d => d.id === id ? { ...d, isActive: !current } : d))
    }

    const f = (key: keyof typeof form, label: string, placeholder = "") => (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--black-text-hover)]">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none focus:border-[var(--dark-blue)] transition-normal"
            />
        </div>
    )

    const states = [...new Set(dealers.map(d => d.state))].sort()

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold vw-font">Concessionárias</h1>
                    <p className="text-sm text-[var(--black-text-hover)]">
                        {pagination ? `${pagination.total} no total` : "Carregando..."}
                    </p>
                </div>
                <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal flex-shrink-0">
                    {showForm ? "Cancelar" : "+ Nova Concessionária"}
                </button>
            </div>

            {formSuccess && (
                <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">{formSuccess}</div>
            )}

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white rounded-xl border border-[var(--white-border)]/30 p-5 flex flex-col gap-4">
                    <h2 className="font-semibold text-sm">Cadastrar concessionária</h2>
                    {formError && <p className="text-red-600 text-sm">{formError}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {f("name", "Nome *", "Baviera Volkswagen")}
                        {f("address", "Endereço *", "Av. Principal, 100")}
                        {f("city", "Cidade *", "São Paulo")}
                        {f("state", "UF *", "SP")}
                        {f("zip", "CEP", "01310-100")}
                        {f("phone", "Telefone", "(11) 3000-0000")}
                        {f("email", "Email", "contato@baviera.com.br")}
                        {f("lat", "Latitude", "-23.5505")}
                        {f("lng", "Longitude", "-46.6333")}
                    </div>
                    <div>
                        <button type="submit" disabled={formLoading} className="px-6 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal disabled:opacity-60">
                            {formLoading ? "Salvando..." : "Cadastrar"}
                        </button>
                    </div>
                </form>
            )}

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setStateFilter("")} className={`px-3 py-1.5 text-xs rounded-lg border transition-normal ${!stateFilter ? "bg-[var(--dark-blue)] text-white border-[var(--dark-blue)]" : "bg-white border-[var(--white-border)]/50 text-[var(--black-text-hover)] hover:border-[var(--dark-blue)]/40"}`}>
                    Todos
                </button>
                {states.map(s => (
                    <button key={s} onClick={() => setStateFilter(s === stateFilter ? "" : s)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-normal ${stateFilter === s ? "bg-[var(--dark-blue)] text-white border-[var(--dark-blue)]" : "bg-white border-[var(--white-border)]/50 text-[var(--black-text-hover)] hover:border-[var(--dark-blue)]/40"}`}>
                        {s}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {isLoading ? (
                    <p className="text-sm text-[var(--black-text-hover)] col-span-full text-center py-8">Carregando...</p>
                ) : dealers.length === 0 ? (
                    <p className="text-sm text-[var(--black-text-hover)] col-span-full text-center py-8">Nenhuma concessionária encontrada.</p>
                ) : dealers.map(dealer => (
                    <div key={dealer.id} className={`bg-white rounded-xl border p-4 flex flex-col gap-3 transition-normal ${dealer.isActive ? "border-[var(--white-border)]/30" : "border-[var(--white-border)]/20 opacity-60"}`}>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-sm">{dealer.name}</h3>
                                <p className="text-xs text-[var(--black-text-hover)]">{dealer.city}, {dealer.state}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${dealer.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                {dealer.isActive ? "Ativa" : "Inativa"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-xs text-[var(--black-text-hover)]">
                            <p>{dealer.address}</p>
                            {dealer.zip && <p>CEP: {dealer.zip}</p>}
                            {dealer.phone && <p>{dealer.phone}</p>}
                            {dealer.email && <p>{dealer.email}</p>}
                            {dealer.lat && dealer.lng && (
                                <p className="font-mono">📍 {dealer.lat.toFixed(4)}, {dealer.lng.toFixed(4)}</p>
                            )}
                        </div>
                        <button onClick={() => toggleActive(dealer.id, dealer.isActive)} className="text-xs text-[var(--dark-blue)] hover:underline text-left">
                            {dealer.isActive ? "Desativar do mapa" : "Reativar no mapa"}
                        </button>
                    </div>
                ))}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-3 py-1 text-xs rounded-lg border border-[var(--white-border)] disabled:opacity-40 hover:bg-[var(--white-border)]/10 transition-fast">
                        Anterior
                    </button>
                    <span className="text-xs text-[var(--black-text-hover)]">{page} / {pagination.pages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                        className="px-3 py-1 text-xs rounded-lg border border-[var(--white-border)] disabled:opacity-40 hover:bg-[var(--white-border)]/10 transition-fast">
                        Próxima
                    </button>
                </div>
            )}
        </div>
    )
}