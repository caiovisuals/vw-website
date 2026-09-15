"use client"

import { useState } from "react"
import { useAuth } from "@/_lib/contexts/AuthContext"
import { useLanguage } from "@/_lib/contexts/LanguageContext"
import { interpolate } from "@/_lib/i18n/translations"
import { api, formatBRL } from "@/_lib/utils/apiClient"

type Props = {
    open: boolean
    onClose: () => void
    carId: string
    carName: string
    configurationCode: string | null
    totalPrice: number
}

const inputClass = "w-full px-4 py-2 rounded-xl border-2 border-[var(--white-border)] focus:border-[var(--dark-blue)] outline-none transition-normal"
const labelClass = "text-sm font-semibold vw-font"

export default function ContactDealerModal({
    open,
    onClose,
    carId,
    carName,
    configurationCode,
    totalPrice,
}: Props) {
    const { user } = useAuth()
    const { t } = useLanguage()

    // Enquanto o usuário não digita, o formulário mostra os dados da conta
    // logada (null = ainda não editado pelo usuário).
    const [nameInput, setName] = useState<string | null>(null)
    const [emailInput, setEmail] = useState<string | null>(null)
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fields, setFields] = useState<Record<string, string>>({})
    const [sent, setSent] = useState(false)

    const name = nameInput ?? user?.name ?? ""
    const email = emailInput ?? user?.email ?? ""

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSending(true)
        setError(null)
        setFields({})

        const res = await api.post<{ id: string }>("/api/leads", {
            carId,
            name,
            email,
            ...(phone ? { phone } : {}),
            message: message || interpolate(
                configurationCode
                    ? t.setting.contactModal.defaultMessageWithCode
                    : t.setting.contactModal.defaultMessage,
                { car: carName, price: formatBRL(totalPrice), code: configurationCode ?? "" }
            ),
        })

        setIsSending(false)

        if (!res.ok) {
            setError(res.error ?? t.setting.contactModal.error)
            setFields(res.fields ?? {})
            return
        }

        setSent(true)
    }

    function handleClose() {
        onClose()
        setError(null)
        setFields({})
        setSent(false)
    }

    return (
        <div onClick={handleClose} className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-normal ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div onClick={(e) => e.stopPropagation()} className={`relative w-full lg:max-w-xl max-h-[85vh] overflow-y-auto bg-[var(--white-background)] rounded-3xl p-6 flex flex-col gap-4 z-51 transition-normal ${open ? "scale-100" : "scale-95"}`}>
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-semibold">{t.setting.contactDealer}</h2>
                    <button onClick={handleClose} aria-label={t.setting.close} className="opacity-50 hover:opacity-100 transition-normal active:scale-95 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                {sent ? (
                    <div className="flex flex-col gap-3">
                        <p>{interpolate(t.setting.contactModal.success, { car: carName })}</p>
                        <button onClick={handleClose} className="w-fit px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 cursor-pointer">
                            {t.setting.close}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <p className="text-sm opacity-70">
                            {carName} · {formatBRL(totalPrice)}
                            {configurationCode ? ` · código ${configurationCode}` : ""}
                        </p>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="lead-name" className={labelClass}>{t.setting.contactModal.name}</label>
                            <input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} className={inputClass} />
                            {fields.name && <span className="text-sm text-red-700">{fields.name}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="lead-email" className={labelClass}>{t.setting.contactModal.email}</label>
                            <input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={120} className={inputClass} />
                            {fields.email && <span className="text-sm text-red-700">{fields.email}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="lead-phone" className={labelClass}>{t.setting.contactModal.phone}</label>
                            <input id="lead-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+55 11 99999-0000" className={inputClass} />
                            {fields.phone && <span className="text-sm text-red-700">{fields.phone}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="lead-message" className={labelClass}>{t.setting.contactModal.message}</label>
                            <textarea id="lead-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3} className={inputClass} />
                            {fields.message && <span className="text-sm text-red-700">{fields.message}</span>}
                        </div>
                        {error && <span className="text-sm text-red-700">{error}</span>}
                        <button type="submit" disabled={isSending} className="w-fit px-6 py-2 rounded-xl bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] text-[var(--white-text)] font-semibold transition-normal active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            {isSending ? t.setting.contactModal.sending : t.setting.contactModal.submit}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}