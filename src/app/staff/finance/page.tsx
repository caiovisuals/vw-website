"use client"

import { useState } from "react"

type FinanceStatus = "EM_ANALISE" | "APROVADO" | "REPROVADO" | "EM_ANDAMENTO" | "CONCLUIDO"

interface FinanceRequest {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string
    carName: string
    carYear: number
    requestedAmount: number
    downPayment: number
    installments: number
    monthlyRate: number
    status: FinanceStatus
    createdAt: string
    updatedAt: string
    notes: string | null
    analyst: string | null
}

const STATUS_LABEL: Record<FinanceStatus, string> = {
    EM_ANALISE:    "Em Análise",
    APROVADO:      "Aprovado",
    REPROVADO:     "Reprovado",
    EM_ANDAMENTO:  "Em Andamento",
    CONCLUIDO:     "Concluído",
}
const STATUS_COLOR: Record<FinanceStatus, string> = {
    EM_ANALISE:    "bg-amber-100 text-amber-800",
    APROVADO:      "bg-blue-100 text-blue-800",
    REPROVADO:     "bg-red-100 text-red-800",
    EM_ANDAMENTO:  "bg-purple-100 text-purple-800",
    CONCLUIDO:     "bg-green-100 text-green-800",
}

const mockData: FinanceRequest[] = [
    {
        id: "fin_001", clientName: "João da Silva", clientEmail: "joao@email.com",
        clientPhone: "(11) 99999-0001", carName: "Jetta GLI", carYear: 2026,
        requestedAmount: 280000, downPayment: 60000, installments: 60, monthlyRate: 0.89,
        status: "EM_ANALISE", createdAt: "2026-04-01T10:30:00Z", updatedAt: "2026-04-01T10:30:00Z",
        notes: null, analyst: null,
    },
    {
        id: "fin_002", clientName: "Maria Oliveira", clientEmail: "maria@email.com",
        clientPhone: "(21) 99888-7766", carName: "Nivus Highline", carYear: 2026,
        requestedAmount: 145000, downPayment: 30000, installments: 48, monthlyRate: 0.89,
        status: "APROVADO", createdAt: "2026-03-28T14:00:00Z", updatedAt: "2026-04-02T09:00:00Z",
        notes: "Renda comprovada. Aprovado pelo Banco VW.", analyst: "Carlos Analista",
    },
    {
        id: "fin_003", clientName: "Pedro Alves", clientEmail: "pedro@email.com",
        clientPhone: "(31) 98765-4321", carName: "Taos Comfortline", carYear: 2025,
        requestedAmount: 175000, downPayment: 20000, installments: 72, monthlyRate: 1.09,
        status: "EM_ANDAMENTO", createdAt: "2026-03-20T08:00:00Z", updatedAt: "2026-04-03T15:00:00Z",
        notes: "Contrato assinado. Aguardando emplacamento.", analyst: "Ana Gestora",
    },
    {
        id: "fin_004", clientName: "Carla Souza", clientEmail: "carla@email.com",
        clientPhone: "(41) 97654-3210", carName: "Polo TSI", carYear: 2026,
        requestedAmount: 95000, downPayment: 10000, installments: 60, monthlyRate: 0.99,
        status: "REPROVADO", createdAt: "2026-03-15T11:00:00Z", updatedAt: "2026-03-18T16:00:00Z",
        notes: "Score de crédito abaixo do mínimo exigido.", analyst: "Carlos Analista",
    },
    {
        id: "fin_005", clientName: "Roberto Lima", clientEmail: "roberto@email.com",
        clientPhone: "(51) 96543-2109", carName: "Amarok Highline", carYear: 2026,
        requestedAmount: 320000, downPayment: 80000, installments: 60, monthlyRate: 0.79,
        status: "CONCLUIDO", createdAt: "2026-02-10T09:00:00Z", updatedAt: "2026-03-05T12:00:00Z",
        notes: "Veículo entregue em 05/03.", analyst: "Ana Gestora",
    },
]

function calcMonthlyInstallment(amount: number, rate: number, n: number): number {
    const r = rate / 100
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function formatCurrency(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(d: string) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d))
}

export default function StaffFinance() {
    const [requests, setRequests] = useState<FinanceRequest[]>(mockData)
    const [statusFilter, setStatusFilter] = useState<FinanceStatus | "">("")
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [editingStatus, setEditingStatus] = useState<{ id: string; status: FinanceStatus } | null>(null)
    const [editNotes, setEditNotes] = useState("")

    const filtered = statusFilter
        ? requests.filter(r => r.status === statusFilter)
        : requests

    const counts = Object.fromEntries(
        (Object.keys(STATUS_LABEL) as FinanceStatus[]).map(s => [s, requests.filter(r => r.status === s).length])
    )

    function openEdit(req: FinanceRequest) {
        setEditingStatus({ id: req.id, status: req.status })
        setEditNotes(req.notes ?? "")
    }

    function saveStatus() {
        if (!editingStatus) return
        setRequests(prev => prev.map(r =>
            r.id === editingStatus.id
                ? { ...r, status: editingStatus.status, notes: editNotes || null, updatedAt: new Date().toISOString() }
                : r
        ))
        setEditingStatus(null)
        setEditNotes("")
    }

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold vw-font">Financiamentos</h1>
                <p className="text-sm text-[var(--black-text-hover)]">{requests.length} solicitações no total</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {(Object.entries(STATUS_LABEL) as [FinanceStatus, string][]).map(([s, label]) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
                        className={`rounded-xl border p-3 flex flex-col gap-1 text-left transition-normal ${
                            statusFilter === s
                                ? "border-[var(--dark-blue)] bg-[var(--dark-blue)]/5"
                                : "border-[var(--white-border)]/30 bg-white hover:border-[var(--dark-blue)]/30"
                        }`}
                    >
                        <span className="text-xs text-[var(--black-text-hover)]">{label}</span>
                        <span className="text-xl font-semibold vw-font">{counts[s]}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-[var(--white-border)]/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--white-border)]/20 text-left">
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Cliente</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden md:table-cell">Veículo</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Valor / Parcela</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Status</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden lg:table-cell">Data</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--white-border)]/10">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">Nenhum registro encontrado.</td></tr>
                            ) : filtered.map(req => {
                                const financed = req.requestedAmount - req.downPayment
                                const monthly = calcMonthlyInstallment(financed, req.monthlyRate, req.installments)
                                return (
                                    <>
                                        <tr key={req.id} className="hover:bg-[#f9f9f8] transition-fast">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{req.clientName}</p>
                                                <p className="text-xs text-[var(--black-text-hover)]">{req.clientEmail}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <p className="font-medium">{req.carName}</p>
                                                <p className="text-xs text-[var(--black-text-hover)]">{req.carYear}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{formatCurrency(req.requestedAmount)}</p>
                                                <p className="text-xs text-[var(--black-text-hover)]">
                                                    {req.installments}x {formatCurrency(monthly)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[req.status]}`}>
                                                    {STATUS_LABEL[req.status]}
                                                </span>
                                                {req.analyst && (
                                                    <p className="text-xs text-[var(--black-text-hover)] mt-0.5">{req.analyst}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-[var(--black-text-hover)] hidden lg:table-cell">
                                                <p>Criado: {formatDate(req.createdAt)}</p>
                                                <p>Atualizado: {formatDate(req.updatedAt)}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <button onClick={() => setExpandedId(expandedId === req.id ? null : req.id)} className="text-xs text-[var(--dark-blue)] hover:underline text-left">
                                                        {expandedId === req.id ? "Fechar" : "Detalhes"}
                                                    </button>
                                                    <button onClick={() => openEdit(req)} className="text-xs text-[var(--dark-blue)] hover:underline text-left">
                                                        Atualizar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedId === req.id && (
                                            <tr key={`${req.id}-detail`}>
                                                <td colSpan={6} className="px-4 py-4 bg-[#f5f5f3] text-sm">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div>
                                                            <p className="text-xs text-[var(--black-text-hover)]">Entrada</p>
                                                            <p className="font-semibold">{formatCurrency(req.downPayment)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-[var(--black-text-hover)]">Valor financiado</p>
                                                            <p className="font-semibold">{formatCurrency(req.requestedAmount - req.downPayment)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-[var(--black-text-hover)]">Taxa mensal</p>
                                                            <p className="font-semibold">{req.monthlyRate}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-[var(--black-text-hover)]">Telefone</p>
                                                            <p className="font-semibold">{req.clientPhone}</p>
                                                        </div>
                                                        {req.notes && (
                                                            <div className="col-span-2 md:col-span-4">
                                                                <p className="text-xs text-[var(--black-text-hover)]">Observações</p>
                                                                <p>{req.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {editingStatus?.id === req.id && (
                                            <tr key={`${req.id}-edit`}>
                                                <td colSpan={6} className="px-4 py-4 bg-blue-50 border-l-4 border-[var(--dark-blue)] text-sm">
                                                    <div className="flex flex-wrap gap-3 items-end">
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-xs text-[var(--black-text-hover)]">Novo Status</label>
                                                            <select
                                                                value={editingStatus.status}
                                                                onChange={e => setEditingStatus(prev => prev ? { ...prev, status: e.target.value as FinanceStatus } : null)}
                                                                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] bg-white focus:outline-none"
                                                            >
                                                                {(Object.entries(STATUS_LABEL) as [FinanceStatus, string][]).map(([k, v]) => (
                                                                    <option key={k} value={k}>{v}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex flex-col gap-1 flex-1 min-w-48">
                                                            <label className="text-xs text-[var(--black-text-hover)]">Observações</label>
                                                            <input
                                                                type="text"
                                                                value={editNotes}
                                                                onChange={e => setEditNotes(e.target.value)}
                                                                placeholder="Adicione uma nota..."
                                                                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none focus:border-[var(--dark-blue)] bg-white"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={saveStatus} className="px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal">
                                                                Salvar
                                                            </button>
                                                            <button onClick={() => setEditingStatus(null)} className="px-4 py-2 rounded-lg border border-[var(--white-border)] text-sm hover:bg-[var(--white-border)]/10 transition-normal">
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}