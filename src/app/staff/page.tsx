"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type LeadStatus = "PENDING" | "CONTACTED" | "CONVERTED" | "LOST"

interface StatsData {
    users: { total: number; thisMonth: number; lastMonth: number; growth: number | null }
    leads: {
        total: number; thisMonth: number; lastMonth: number; growth: number | null
        byStatus: { pending: number; contacted: number; converted: number; lost: number }
    }
    cars: { total: number; active: number }
    dealers: { total: number }
    recentLeads: Array<{
        id: string; name: string; email: string; status: LeadStatus; createdAt: string
        car: { name: string } | null
        dealer: { name: string } | null
    }>
    topCars: Array<{ carId: string; count: number; car: { name: string; imageUrl: string | null } | null }>
}

const STATUS_LABEL: Record<LeadStatus, string> = {
    PENDING:   "Pendente",
    CONTACTED: "Contatado",
    CONVERTED: "Convertido",
    LOST:      "Perdido",
}

const STATUS_COLOR: Record<LeadStatus, string> = {
    PENDING:   "bg-amber-100 text-amber-800",
    CONTACTED: "bg-blue-100 text-blue-800",
    CONVERTED: "bg-green-100 text-green-800",
    LOST:      "bg-red-100 text-red-800",
}

function StatCard({
    label, value, sub, subColor,
}: { label: string; value: string | number; sub?: string; subColor?: string }) {
    return (
        <div className="bg-white rounded-xl border-2 border-[var(--white-border)]/30 p-4 flex flex-col gap-1">
            <span className="text-xs text-[var(--black-text-hover)]">{label}</span>
            <span className="text-2xl font-semibold vw-font">{value}</span>
            {sub && (
                <span className={`text-xs ${subColor ?? "text-[var(--black-text-hover)]"}`}>{sub}</span>
            )}
        </div>
    )
}

function growthText(growth: number | null, month: number): string {
    if (growth === null) return `${month} este mês`
    const sign = growth >= 0 ? "+" : ""
    return `${sign}${growth}% vs. mês anterior`
}

export default function StaffDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/staff/stats", { credentials: "include" })
            .then(r => r.json())
            .then(json => {
                if (json.success) setStats(json.data)
                else setError(json.error ?? "Erro ao carregar estatísticas.")
            })
            .catch(() => setError("Erro de conexão."))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="size-8 border-2 border-[var(--dark-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-600">{error ?? "Dados indisponíveis."}</p>
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold vw-font">Dashboard</h1>
                <p className="text-sm text-[var(--black-text-hover)]">Visão geral do sistema</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Total de Usuários"
                    value={stats.users.total.toLocaleString("pt-BR")}
                    sub={growthText(stats.users.growth, stats.users.thisMonth)}
                    subColor={stats.users.growth !== null && stats.users.growth >= 0 ? "text-green-600" : "text-red-500"}
                />
                <StatCard
                    label="Total de Leads"
                    value={stats.leads.total.toLocaleString("pt-BR")}
                    sub={growthText(stats.leads.growth, stats.leads.thisMonth)}
                    subColor={stats.leads.growth !== null && stats.leads.growth >= 0 ? "text-green-600" : "text-red-500"}
                />
                <StatCard
                    label="Carros Ativos"
                    value={stats.cars.active}
                    sub={`de ${stats.cars.total} cadastrados`}
                />
                <StatCard
                    label="Concessionárias"
                    value={stats.dealers.total}
                    sub="ativas no mapa"
                />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Pendentes" value={stats.leads.byStatus.pending} />
                <StatCard label="Contatados" value={stats.leads.byStatus.contacted} />
                <StatCard label="Convertidos" value={stats.leads.byStatus.converted} subColor="text-green-600" />
                <StatCard label="Perdidos" value={stats.leads.byStatus.lost} subColor="text-red-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border-2 border-[var(--white-border)]/30 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--white-border)]/20">
                        <h2 className="font-semibold text-sm">Leads Recentes</h2>
                        <Link href="/staff/leads" className="text-xs text-[var(--dark-blue)] hover:underline">Ver todos</Link>
                    </div>
                    <div className="divide-y divide-[var(--white-border)]/10">
                        {stats.recentLeads.length === 0 && (
                            <p className="text-sm text-[var(--black-text-hover)] p-4">Nenhum lead ainda.</p>
                        )}
                        {stats.recentLeads.map(lead => (
                            <div key={lead.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#f9f9f8] transition-fast">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{lead.name}</span>
                                    <span className="text-xs text-[var(--black-text-hover)]">
                                        {lead.car?.name ?? "—"} · {lead.dealer?.name ?? "sem concessionária"}
                                    </span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[lead.status]}`}>
                                    {STATUS_LABEL[lead.status]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border-2 border-[var(--white-border)]/30 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--white-border)]/20">
                        <h2 className="font-semibold text-sm">Top Modelos</h2>
                        <Link href="/staff/leads" className="text-xs text-[var(--dark-blue)] hover:underline">Leads</Link>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        {stats.topCars.length === 0 && (
                            <p className="text-sm text-[var(--black-text-hover)]">Sem dados ainda.</p>
                        )}
                        {stats.topCars.map((item, i) => (
                            <div key={item.carId} className="flex items-center gap-3">
                                <span className="text-xs text-[var(--black-text-hover)] w-4">{i + 1}.</span>
                                <div className="flex-1 flex flex-col">
                                    <span className="text-sm font-medium">{item.car?.name ?? item.carId}</span>
                                    <div className="h-1.5 bg-[#e8e8e6] rounded-full mt-1 overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--dark-blue)] rounded-full"
                                            style={{ width: `${Math.min(100, (item.count / (stats.topCars[0]?.count || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-[var(--dark-blue)]">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { href: "/staff/users", label: "Gerenciar Usuários", icon: "👥" },
                    { href: "/staff/leads", label: "Ver Leads", icon: "📋" },
                    { href: "/staff/cars", label: "Cadastrar Carro", icon: "🚗" },
                    { href: "/staff/offers", label: "Nova Oferta", icon: "🏷️" },
                ].map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="bg-white rounded-xl border-2 border-[var(--white-border)]/30 p-4 flex items-center gap-3 hover:border-[var(--dark-blue)]/40 hover:shadow-sm transition-normal"
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}