"use client"

import { useEffect, useState, useCallback } from "react"

type LeadStatus = "PENDING" | "CONTACTED" | "CONVERTED" | "LOST"

interface Lead {
    id: string
    name: string
    email: string
    phone: string | null
    message: string | null
    status: LeadStatus
    createdAt: string
    car: { name: string; slug: string } | null
    dealer: { name: string; city: string } | null
    user: { name: string; email: string } | null
}

interface Pagination { total: number; page: number; limit: number; pages: number }

const STATUS_LABEL: Record<LeadStatus, string> = {
    PENDING: "Pendente", CONTACTED: "Contatado", CONVERTED: "Convertido", LOST: "Perdido",
}
const STATUS_COLOR: Record<LeadStatus, string> = {
    PENDING:   "bg-amber-100 text-amber-800 border-amber-200",
    CONTACTED: "bg-blue-100 text-blue-800 border-blue-200",
    CONVERTED: "bg-green-100 text-green-800 border-green-200",
    LOST:      "bg-red-100 text-red-800 border-red-200",
}

function formatDate(d: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(d))
}

export default function StaffLeads() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("")
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const fetchLeads = useCallback(async () => {
        setIsLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: "20" })
        if (statusFilter) params.set("status", statusFilter)
        try {
            const res = await fetch(`/api/leads?${params}`, { credentials: "include" })
            const json = await res.json()
            if (json.success) {
                setLeads(json.data.leads)
                setPagination(json.data.pagination)
            }
        } finally {
            setIsLoading(false)
        }
    }, [page, statusFilter])

    useEffect(() => { fetchLeads() }, [fetchLeads])

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold vw-font">Leads</h1>
                <p className="text-sm text-[var(--black-text-hover)]">
                    {pagination ? `${pagination.total} leads no total` : "Carregando..."}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {(["", "PENDING", "CONTACTED", "CONVERTED", "LOST"] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setPage(1) }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-normal ${
                            statusFilter === s
                                ? "bg-[var(--dark-blue)] text-white border-[var(--dark-blue)]"
                                : "bg-white text-[var(--black-text-hover)] border-[var(--white-border)]/50 hover:border-[var(--dark-blue)]/40"
                        }`}
                    >
                        {s === "" ? "Todos" : STATUS_LABEL[s]}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border-2 border-[var(--white-border)]/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--white-border)]/20 text-left">
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Contato</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden md:table-cell">Modelo</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden lg:table-cell">Concessionária</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Status</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden md:table-cell">Data</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Detalhe</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--white-border)]/10">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">
                                        Nenhum lead encontrado.
                                    </td>
                                </tr>
                            ) : leads.map(lead => (
                                <>
                                    <tr key={lead.id} className="hover:bg-[#f9f9f8] transition-fast">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{lead.name}</p>
                                            <p className="text-xs text-[var(--black-text-hover)]">{lead.email}</p>
                                            {lead.phone && <p className="text-xs text-[var(--black-text-hover)]">{lead.phone}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-xs hidden md:table-cell">
                                            {lead.car?.name ?? <span className="opacity-40">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-xs hidden lg:table-cell">
                                            {lead.dealer
                                                ? <span>{lead.dealer.name} <span className="opacity-60">· {lead.dealer.city}</span></span>
                                                : <span className="opacity-40">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border-2 ${STATUS_COLOR[lead.status]}`}>
                                                {STATUS_LABEL[lead.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[var(--black-text-hover)] hidden md:table-cell">
                                            {formatDate(lead.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                                                className="text-xs text-[var(--dark-blue)] hover:underline"
                                            >
                                                {expandedId === lead.id ? "Fechar" : "Ver mais"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === lead.id && (
                                        <tr key={`${lead.id}-detail`}>
                                            <td colSpan={6} className="px-4 py-3 bg-[#f5f5f3] text-sm">
                                                <div className="flex flex-wrap gap-6">
                                                    {lead.user && (
                                                        <div>
                                                            <p className="text-xs text-[var(--black-text-hover)] mb-0.5">Usuário cadastrado</p>
                                                            <p className="font-medium">{lead.user.name}</p>
                                                            <p className="text-xs">{lead.user.email}</p>
                                                        </div>
                                                    )}
                                                    {lead.message && (
                                                        <div className="max-w-md">
                                                            <p className="text-xs text-[var(--black-text-hover)] mb-0.5">Mensagem</p>
                                                            <p>{lead.message}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs text-[var(--black-text-hover)] mb-0.5">ID do Lead</p>
                                                        <p className="font-mono text-xs">{lead.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t-2 border-[var(--white-border)]/20">
                        <span className="text-xs text-[var(--black-text-hover)]">
                            Página {pagination.page} de {pagination.pages}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1 text-xs rounded-lg border-2 border-[var(--white-border)] disabled:opacity-40 hover:bg-[var(--white-border)]/10 transition-fast">
                                Anterior
                            </button>
                            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                                className="px-3 py-1 text-xs rounded-lg border-2 border-[var(--white-border)] disabled:opacity-40 hover:bg-[var(--white-border)]/10 transition-fast">
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}