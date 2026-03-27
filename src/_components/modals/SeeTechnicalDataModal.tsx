"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

type Props = {
    open: boolean
    onClose: () => void
}

export default function SeeTechnicalDataModal({
    open,
    onClose,
}: Props) {
    const { t } = useLanguage()

    return (
        <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center transition-normal ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div onClick={(e) => e.stopPropagation()} className={`relative w-full lg:max-w-xl bg-[var(--white-background)] rounded-3xl p-6 flex flex-col gap-2 z-51 transition-normal ${open ? "scale-100" : "scale-95"}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Dados Técnicos do Jetta</h2>
                    <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-normal active:scale-95 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
                <div>
                    <span>Motor</span>
                    <div>
                        <span></span>
                    </div>
                </div>
                <div>
                    <span>Transmissão</span>
                    <div>
                        <span></span>
                    </div>
                </div>
                <div>
                    <span>Suspensão</span>
                    <div>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}