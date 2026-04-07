"use client"

import Image from "next/image"
import { useEffect, useState, useCallback } from "react"

type Role = "USER" | "STAFF" | "ADMIN"

interface User {
    id: string
    name: string
    email: string
    role: Role
    phone: string | null
    avatarUrl: string | null
    createdAt: string
    lastLoginAt: string | null
    emailVerified: string | null
    _count: { savedConfigs: number; leads: number }
}

interface Pagination {
    total: number; page: number; limit: number; pages: number
}

const ROLE_LABEL: Record<Role, string> = { USER: "Cliente", STAFF: "Equipe", ADMIN: "Admin" }
const ROLE_COLOR: Record<Role, string> = {
    USER:  "bg-gray-100 text-gray-700",
    STAFF: "bg-blue-100 text-blue-700",
    ADMIN: "bg-purple-100 text-purple-700",
}

function formatDate(d: string | null) {
    if (!d) return "—"
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d))
}

export default function StaffUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState<Role | "">("")
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [editingRole, setEditingRole] = useState<{ userId: string; current: Role } | null>(null)
    const [editLoading, setEditLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: "20" })
        if (search) params.set("search", search)
        if (role) params.set("role", role)

        try {
            const res = await fetch(`/api/staff/users?${params}`, { credentials: "include" })
            const json = await res.json()
            if (json.success) {
                setUsers(json.data.users)
                setPagination(json.data.pagination)
            }
        } finally {
            setIsLoading(false)
        }
    }, [page, search, role])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPage(1)
        fetchUsers()
    }

    async function changeRole(userId: string, newRole: Role) {
        setEditLoading(true)
        try {
            const res = await fetch(`/api/staff/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ role: newRole }),
            })
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
                setEditingRole(null)
            }
        } finally {
            setEditLoading(false)
        }
    }

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold vw-font">Usuários</h1>
                <p className="text-sm text-[var(--black-text-hover)]">
                    {pagination ? `${pagination.total} usuários cadastrados` : "Carregando..."}
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-48 px-3 py-2 rounded-lg border-2 border-[var(--white-border)] focus:outline-none focus:border-[var(--dark-blue)] text-sm transition-normal"
                />
                <select
                    value={role}
                    onChange={e => { setRole(e.target.value as Role | ""); setPage(1) }}
                    className="px-3 py-2 rounded-lg border-2 border-[var(--white-border)] focus:outline-none focus:border-[var(--dark-blue)] text-sm transition-normal bg-white"
                >
                    <option value="">Todos os cargos</option>
                    <option value="USER">Cliente</option>
                    <option value="STAFF">Equipe</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal cursor-pointer"
                >
                    Buscar
                </button>
            </form>

            <div className="bg-white rounded-xl border-2 border-[var(--white-border)]/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-[var(--white-border)]/20 text-left">
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Usuário</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Cargo</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden md:table-cell">Cadastro</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden lg:table-cell">Último login</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)] hidden lg:table-cell">Configs / Leads</th>
                                <th className="px-4 py-3 font-medium text-[var(--black-text-hover)]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--white-border)]/10">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--black-text-hover)]">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-[#f9f9f8] transition-fast">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="relative size-8 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Image src={user.avatarUrl || "/assets/avatar-default.jpg"} alt={user.name} width={32} height={32} className="rounded-full" draggable={false} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{user.name}</p>
                                                <p className="text-xs text-[var(--black-text-hover)] truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingRole?.userId === user.id ? (
                                            <div className="flex items-center gap-1">
                                                <select
                                                    defaultValue={user.role}
                                                    onChange={e => changeRole(user.id, e.target.value as Role)}
                                                    disabled={editLoading}
                                                    className="text-xs px-2 py-1 rounded border-2 border-[var(--white-border)] bg-[var(--white-background)]"
                                                >
                                                    <option value="USER">Cliente</option>
                                                    <option value="STAFF">Equipe</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => setEditingRole(null)}
                                                    className="text-xs text-[var(--black-text-hover)] hover:text-red-500 transition-fast"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLOR[user.role]}`}>
                                                {ROLE_LABEL[user.role]}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[var(--black-text-hover)] hidden md:table-cell">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[var(--black-text-hover)] hidden lg:table-cell">
                                        {formatDate(user.lastLoginAt)}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[var(--black-text-hover)] hidden lg:table-cell">
                                        {user._count.savedConfigs} configs · {user._count.leads} leads
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setEditingRole({ userId: user.id, current: user.role })}
                                            className="text-xs text-[var(--dark-blue)] hover:underline"
                                        >
                                            Editar cargo
                                        </button>
                                    </td>
                                </tr>
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
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 text-xs rounded-lg border-2 border-[var(--white-border)] disabled:opacity-40 hover:bg-[var(--white-border)]/10 transition-fast"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={pagination.page === pagination.pages}
                                className="px-3 py-1 text-xs rounded-lg border-2 border-[var(--white-border)] disabled:opacity-40 hover:bg-[var(--white-border)]/10 transition-fast"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}