"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import AuthGate from "@/_components/AuthGate"
import ShowPassword from "@/_components/ui/ShowPassword"
import { api, formatBRL, formatDate } from "@/_lib/utils/apiClient"
import { useAuth, type AuthUser, type Role } from "@/_lib/contexts/AuthContext"

type Account = {
    id: string
    name: string
    email: string
    role: Role
    phone: string | null
    createdAt: string
    lastLoginAt: string | null
}

type SavedConfig = {
    id: string
    code: string
    totalPrice: string
    updatedAt: string
    car: { name: string; slug: string; imageUrl: string | null }
}

type Feedback = { type: "success" | "error"; text: string } | null

function getRoleLabel(role: Role) {
    switch (role) {
        case "ADMIN": return "Administrador"
        case "STAFF": return "Equipe"
        default: return "Cliente"
    }
}

const inputClass = "w-full px-4 py-2 rounded-xl border-2 border-[var(--white-text-hover)] focus:border-[var(--dark-blue)] outline-none transition-normal"
const labelClass = "text-sm font-semibold vw-font"
const primaryButtonClass = "px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
    if (!feedback) return null

    return (
        <p
            role="status"
            className={`text-sm px-4 py-2 rounded-xl ${
                feedback.type === "success"
                    ? "bg-[var(--dark-blue)]/10 text-[var(--dark-blue)]"
                    : "bg-red-50 text-red-700"
            }`}
        >
            {feedback.text}
        </p>
    )
}

function ProfileContent({ user }: { user: AuthUser }) {
    const { refetch } = useAuth()

    const [account, setAccount] = useState<Account | null>(null)
    const [configs, setConfigs] = useState<SavedConfig[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [name, setName] = useState(user.name)
    const [phone, setPhone] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [profileFeedback, setProfileFeedback] = useState<Feedback>(null)
    const [profileFields, setProfileFields] = useState<Record<string, string>>({})

    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null)
    const [passwordFields, setPasswordFields] = useState<Record<string, string>>({})

    const [removingCode, setRemovingCode] = useState<string | null>(null)

    const loadConfigs = useCallback(async () => {
        const res = await api.get<SavedConfig[]>("/api/configurations")
        if (res.ok && res.data) setConfigs(res.data)
    }, [])

    useEffect(() => {
        let active = true

        async function load() {
            const [accountRes] = await Promise.all([
                api.get<Account>(`/api/users/${user.id}`),
                loadConfigs(),
            ])

            if (!active) return

            if (accountRes.ok && accountRes.data) {
                setAccount(accountRes.data)
                setName(accountRes.data.name)
                setPhone(accountRes.data.phone ?? "")
            }
            setIsLoading(false)
        }

        load()
        return () => { active = false }
    }, [user.id, loadConfigs])

    async function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSavingProfile(true)
        setProfileFeedback(null)
        setProfileFields({})

        const res = await api.patch<Account>(`/api/users/${user.id}`, { name: name.trim(), phone: phone.trim() })

        if (res.ok) {
            setProfileFeedback({ type: "success", text: res.message ?? "Perfil atualizado." })
            setIsEditing(false)
            setAccount((prev) => (prev ? { ...prev, name: name.trim(), phone: phone.trim() || null } : prev))
            await refetch()
        } else {
            setProfileFields(res.fields ?? {})
            setProfileFeedback({ type: "error", text: res.error ?? "Não foi possível atualizar o perfil." })
        }

        setIsSavingProfile(false)
    }

    async function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSavingPassword(true)
        setPasswordFeedback(null)
        setPasswordFields({})

        const res = await api.post("/api/auth/change-password", { currentPassword, password, confirmPassword })

        if (res.ok) {
            setPasswordFeedback({ type: "success", text: res.message ?? "Senha alterada com sucesso." })
            setCurrentPassword("")
            setPassword("")
            setConfirmPassword("")
        } else {
            setPasswordFields(res.fields ?? {})
            setPasswordFeedback({ type: "error", text: res.error ?? "Não foi possível alterar a senha." })
        }

        setIsSavingPassword(false)
    }

    async function handleRemoveConfig(code: string) {
        setRemovingCode(code)
        const res = await api.del(`/api/configurations/${code}`)
        if (res.ok) {
            setConfigs((prev) => prev.filter((c) => c.code !== code))
        }
        setRemovingCode(null)
    }

    function cancelEditing() {
        setName(account?.name ?? user.name)
        setPhone(account?.phone ?? "")
        setProfileFields({})
        setProfileFeedback(null)
        setIsEditing(false)
    }

    return (
        <div className="flex flex-col gap-10 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="flex flex-col">
                <div className="relative">
                    <div className="w-full h-60 bg-gradient-to-br from-black to-[var(--dark-blue)] rounded-3xl" />
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 p-6 -mt-25">
                    <div className="flex flex-col gap-3">
                        <div className="relative size-40 border-5 border-[var(--white-background)] rounded-full aspect-square">
                            <Image src={user.avatarUrl ?? "/assets/avatar-default.jpg"} alt={`Avatar de ${user.name}`} className="object-cover aspect-square rounded-full bg-[var(--white-background)] select-none" draggable="false" fill sizes="160px" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold vw-font">{account?.name ?? user.name}</h1>
                            <span className="text-xl vw-font leading-tight">{getRoleLabel(user.role)}</span>
                        </div>
                    </div>
                    {user.role !== "USER" && (
                        <Link href="/staff" className="flex items-center justify-center gap-2 whitespace-nowrap px-6 py-2 rounded-xl border-2 border-[var(--dark-blue)] text-[var(--dark-blue)] hover:bg-[var(--dark-blue)] hover:text-[var(--white-text)] font-semibold transition-normal active:scale-95 w-fit">
                            Painel da equipe
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="flex flex-col gap-4 p-6 rounded-3xl border-2 border-[var(--white-text-hover)]">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <h2 className="text-2xl font-semibold vw-font">Dados pessoais</h2>
                        {!isEditing && (
                            <button type="button" onClick={() => setIsEditing(true)} className="text-[var(--dark-blue)] hover:text-[var(--medium-blue)] underline transition-normal cursor-pointer">
                                Editar
                            </button>
                        )}
                    </div>

                    <FeedbackBanner feedback={profileFeedback} />

                    {isEditing ? (
                        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className={labelClass}>Nome</label>
                                <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} className={inputClass} />
                                {profileFields.name && <span className="text-sm text-red-700">{profileFields.name}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="phone" className={labelClass}>Telefone</label>
                                <input id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 11 99999-0000" className={inputClass} />
                                {profileFields.phone && <span className="text-sm text-red-700">{profileFields.phone}</span>}
                            </div>
                            <div className="flex flex-row gap-3">
                                <button type="submit" disabled={isSavingProfile} className={primaryButtonClass}>
                                    {isSavingProfile ? "Salvando..." : "Salvar"}
                                </button>
                                <button type="button" onClick={cancelEditing} className="px-6 py-2 rounded-xl border-2 border-[var(--white-text-hover)] hover:border-[var(--dark-blue)] font-semibold transition-normal active:scale-95 cursor-pointer">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <dl className="flex flex-col gap-3">
                            <div className="flex flex-col">
                                <dt className="text-sm text-[var(--black-text-hover)]">Nome</dt>
                                <dd className="text-lg">{account?.name ?? user.name}</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-sm text-[var(--black-text-hover)]">E-mail</dt>
                                <dd className="text-lg">{account?.email ?? user.email}</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-sm text-[var(--black-text-hover)]">Telefone</dt>
                                <dd className="text-lg">{account?.phone || "Não informado"}</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-sm text-[var(--black-text-hover)]">Cliente desde</dt>
                                <dd className="text-lg">{account ? formatDate(account.createdAt) : "—"}</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="text-sm text-[var(--black-text-hover)]">Último acesso</dt>
                                <dd className="text-lg">{account?.lastLoginAt ? formatDate(account.lastLoginAt) : "—"}</dd>
                            </div>
                        </dl>
                    )}
                </section>

                <section className="flex flex-col gap-4 p-6 rounded-3xl border-2 border-[var(--white-text-hover)]">
                    <h2 className="text-2xl font-semibold vw-font">Alterar senha</h2>

                    <FeedbackBanner feedback={passwordFeedback} />

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="currentPassword" className={labelClass}>Senha atual</label>
                            <div className="relative">
                                <input id="currentPassword" name="currentPassword" type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required maxLength={128} className={`${inputClass} pr-12`} />
                                <ShowPassword show={showCurrent} setShow={setShowCurrent} />
                            </div>
                            {passwordFields.currentPassword && <span className="text-sm text-red-700">{passwordFields.currentPassword}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className={labelClass}>Nova senha</label>
                            <div className="relative">
                                <input id="password" name="password" type={showNew ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={128} className={`${inputClass} pr-12`} />
                                <ShowPassword show={showNew} setShow={setShowNew} />
                            </div>
                            <span className="text-sm text-[var(--black-text-hover)]">Mínimo de 8 caracteres, com uma letra maiúscula e um número.</span>
                            {passwordFields.password && <span className="text-sm text-red-700">{passwordFields.password}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="confirmPassword" className={labelClass}>Confirmar nova senha</label>
                            <div className="relative">
                                <input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required maxLength={128} className={`${inputClass} pr-12`} />
                                <ShowPassword show={showConfirm} setShow={setShowConfirm} />
                            </div>
                            {passwordFields.confirmPassword && <span className="text-sm text-red-700">{passwordFields.confirmPassword}</span>}
                        </div>
                        <button type="submit" disabled={isSavingPassword} className={`${primaryButtonClass} w-fit`}>
                            {isSavingPassword ? "Alterando..." : "Alterar senha"}
                        </button>
                    </form>
                </section>
            </div>

            <section id="configuracoes" className="flex flex-col gap-4 scroll-mt-24">
                <div className="flex flex-row items-end justify-between gap-4">
                    <h2 className="text-2xl font-semibold vw-font">Configurações salvas</h2>
                    <Link href="/build-your-model" className="text-[var(--dark-blue)] hover:text-[var(--medium-blue)] underline transition-normal whitespace-nowrap">
                        Montar outro
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-64 rounded-3xl bg-[var(--white-text-hover)]/40 animate-pulse" />
                        ))}
                    </div>
                ) : configs.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 text-center border-2 border-dashed border-[var(--white-text-hover)] rounded-3xl py-12 px-6">
                        <p className="text-lg vw-font">Nenhuma configuração salva até agora.</p>
                        <Link href="/build-your-model" className={primaryButtonClass}>
                            Montar meu Volkswagen
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {configs.map((config) => (
                            <article key={config.id} className="flex flex-col border-2 border-[var(--white-text-hover)] rounded-3xl overflow-hidden hover:shadow-md transition-normal">
                                <div className="relative h-40 bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)]">
                                    {config.car.imageUrl && (
                                        <Image src={config.car.imageUrl} alt={config.car.name} className="object-contain select-none p-4" draggable="false" fill sizes="(max-width: 768px) 100vw, 33vw" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 p-5">
                                    <span className="text-sm text-[var(--black-text-hover)]">Código {config.code}</span>
                                    <h3 className="text-xl font-semibold vw-font">{config.car.name}</h3>
                                    <p className="text-lg font-semibold">{formatBRL(config.totalPrice)}</p>
                                    <span className="text-sm text-[var(--black-text-hover)]">Atualizada em {formatDate(config.updatedAt)}</span>
                                    <div className="flex flex-row gap-2 mt-3">
                                        <Link href={`/car/${config.car.slug}`} className="flex-1 text-center px-4 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95">
                                            Ver modelo
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveConfig(config.code)}
                                            disabled={removingCode === config.code}
                                            aria-label={`Remover configuração ${config.code}`}
                                            className="px-4 py-2 rounded-xl border-2 border-[var(--white-text-hover)] hover:border-red-600 hover:text-red-600 transition-normal active:scale-95 disabled:opacity-50 cursor-pointer"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default function Profile() {
    return <AuthGate>{(user) => <ProfileContent user={user} />}</AuthGate>
}