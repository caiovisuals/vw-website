"use client"

import { useState } from "react"
import Image from "next/image"

type OfferCategory = "hatch" | "suv" | "sedan" | "picape"
type OfferType = "novo" | "seminovo"

interface Offer {
    id: string
    name: string
    title: string
    subtitle: string
    category: OfferCategory
    model: string
    type: OfferType
    price: number
    discount: number | null
    imageUrl: string
    active: boolean
    validUntil: string | null
    badge: string | null
}

const CATEGORY_LABEL: Record<OfferCategory, string> = {
    hatch: "Hatch", suv: "SUV", sedan: "Sedan", picape: "Picape",
}

const initialOffers: Offer[] = [
    {
        id: "1", name: "Jetta", title: "Jetta GLI + Entrada de até R$ 20.000",
        subtitle: "Parcelas a partir de R$ 2.890/mês", category: "sedan", model: "jetta",
        type: "novo", price: 280000, discount: 20000, imageUrl: "/assets/cars/jetta/jetta.webp",
        active: true, validUntil: "2026-06-30", badge: "Mais Vendido",
    },
    {
        id: "2", name: "Nivus", title: "Nivus Highline + Bônus de até R$ 30.000",
        subtitle: "Condições especiais no Banco VW", category: "suv", model: "nivus",
        type: "novo", price: 145000, discount: 30000, imageUrl: "/assets/cars/nivus/nivus.webp",
        active: true, validUntil: "2026-05-31", badge: null,
    },
    {
        id: "3", name: "Polo", title: "Polo TSI a partir de R$ 45.000",
        subtitle: "Oferta exclusiva para PF", category: "hatch", model: "polo",
        type: "seminovo", price: 45000, discount: null, imageUrl: "/assets/cars/polo/polo.webp",
        active: false, validUntil: null, badge: null,
    },
]

const emptyForm: Omit<Offer, "id"> = {
    name: "", title: "", subtitle: "", category: "hatch", model: "",
    type: "novo", price: 0, discount: null, imageUrl: "",
    active: true, validUntil: "", badge: "",
}

export default function StaffOffers() {
    const [offers, setOffers] = useState<Offer[]>(initialOffers)
    const [showForm, setShowForm] = useState(false)
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
    const [form, setForm] = useState<Omit<Offer, "id">>({ ...emptyForm })
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    function openCreate() {
        setEditingOffer(null)
        setForm({ ...emptyForm })
        setShowForm(true)
    }

    function openEdit(offer: Offer) {
        setEditingOffer(offer)
        setForm({ ...offer })
        setShowForm(true)
    }

    function handleSave() {
        if (editingOffer) {
            setOffers(prev => prev.map(o => o.id === editingOffer.id ? { ...form, id: editingOffer.id } : o))
        } else {
            const newOffer: Offer = { ...form, id: String(Date.now()), discount: form.discount || null, badge: form.badge || null, validUntil: form.validUntil || null }
            setOffers(prev => [newOffer, ...prev])
        }
        setShowForm(false)
        setEditingOffer(null)
    }

    function handleDelete(id: string) {
        setOffers(prev => prev.filter(o => o.id !== id))
        setDeleteConfirm(null)
    }

    function toggleActive(id: string) {
        setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o))
    }

    const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--black-text-hover)]">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={String(form[key] ?? "")}
                onChange={e => {
                    const val = type === "number" ? (e.target.value ? Number(e.target.value) : 0) : e.target.value
                    setForm(prev => ({ ...prev, [key]: val }))
                }}
                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none focus:border-[var(--dark-blue)] transition-normal"
            />
        </div>
    )

    return (
        <div className="p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold vw-font">Ofertas</h1>
                    <p className="text-sm text-[var(--black-text-hover)]">{offers.length} ofertas · {offers.filter(o => o.active).length} ativas</p>
                </div>
                <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal flex-shrink-0">
                    + Nova Oferta
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border border-[var(--white-border)]/30 p-5 flex flex-col gap-4">
                    <h2 className="font-semibold text-sm">{editingOffer ? "Editar Oferta" : "Nova Oferta"}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {field("name", "Nome do Modelo", "text", "Ex: Jetta")}
                        {field("title", "Título da Oferta", "text", "Ex: Jetta GLI + Entrada de...")}
                        {field("subtitle", "Subtítulo", "text", "Ex: Parcelas a partir de...")}
                        {field("price", "Preço (R$)", "number", "280000")}
                        {field("discount", "Desconto/Bônus (R$)", "number", "20000")}
                        {field("imageUrl", "URL da Imagem", "text", "/assets/cars/...")}
                        {field("validUntil", "Válido até", "date")}
                        {field("badge", "Badge", "text", "Ex: Mais Vendido")}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--black-text-hover)]">Categoria</label>
                            <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value as OfferCategory }))}
                                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none bg-white transition-normal">
                                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-[var(--black-text-hover)]">Tipo</label>
                            <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as OfferType }))}
                                className="px-3 py-2 text-sm rounded-lg border border-[var(--white-border)] focus:outline-none bg-white transition-normal">
                                <option value="novo">Novo</option>
                                <option value="seminovo">Seminovo</option>
                            </select>
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.active} onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))} />
                        Oferta ativa (visível no site)
                    </label>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-[var(--dark-blue)] text-white text-sm hover:bg-[var(--medium-blue)] transition-normal">
                            {editingOffer ? "Salvar Alterações" : "Criar Oferta"}
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg border border-[var(--white-border)] text-sm hover:bg-[var(--white-border)]/10 transition-normal">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {offers.map(offer => (
                    <div key={offer.id} className={`bg-white rounded-xl border overflow-hidden transition-normal ${offer.active ? "border-[var(--white-border)]/30" : "border-[var(--white-border)]/20 opacity-60"}`}>
                        <div className="relative h-44 bg-[#e8e8e6]">
                            <Image
                                src={offer.imageUrl || "/assets/cars/jetta/jetta.webp"}
                                alt={offer.name}
                                fill
                                className="object-contain p-4"
                                onError={() => {}}
                            />
                            {offer.badge && (
                                <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-[var(--dark-blue)] text-white font-medium">
                                    {offer.badge}
                                </span>
                            )}
                            <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${offer.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                {offer.active ? "Ativa" : "Inativa"}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <div>
                                <p className="text-xs text-[var(--black-text-hover)]">{CATEGORY_LABEL[offer.category]} · {offer.type}</p>
                                <h3 className="font-semibold text-sm leading-snug">{offer.title}</h3>
                                {offer.subtitle && <p className="text-xs text-[var(--black-text-hover)] mt-0.5">{offer.subtitle}</p>}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold">{offer.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                {offer.discount && (
                                    <span className="text-xs text-green-600 font-medium">-{offer.discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                )}
                            </div>
                            {offer.validUntil && (
                                <p className="text-xs text-[var(--black-text-hover)]">
                                    Válido até {new Intl.DateTimeFormat("pt-BR").format(new Date(offer.validUntil))}
                                </p>
                            )}
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => openEdit(offer)} className="flex-1 text-xs py-1.5 rounded-lg border border-[var(--white-border)] hover:bg-[var(--white-border)]/10 transition-normal">
                                    Editar
                                </button>
                                <button onClick={() => toggleActive(offer.id)} className="flex-1 text-xs py-1.5 rounded-lg border border-[var(--white-border)] hover:bg-[var(--white-border)]/10 transition-normal">
                                    {offer.active ? "Desativar" : "Ativar"}
                                </button>
                                {deleteConfirm === offer.id ? (
                                    <div className="flex gap-1">
                                        <button onClick={() => handleDelete(offer.id)} className="text-xs py-1.5 px-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-normal">
                                            Confirmar
                                        </button>
                                        <button onClick={() => setDeleteConfirm(null)} className="text-xs py-1.5 px-2 rounded-lg border border-[var(--white-border)] transition-normal">
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setDeleteConfirm(offer.id)} className="text-xs py-1.5 px-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-normal">
                                        Excluir
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}