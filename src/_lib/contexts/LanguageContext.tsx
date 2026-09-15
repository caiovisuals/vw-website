"use client"

import {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useSyncExternalStore,
    type ReactNode,
} from "react"
import { translations, type Locale, type Translations } from "@/_lib/i18n/translations"

const STORAGE_KEY = "vw_locale"
const DEFAULT_LOCALE: Locale = "pt-BR"

interface LanguageContextValue {
    locale: Locale
    t: Translations
    setLocale: (locale: Locale) => void
    toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function resolvePreferredLocale(): Locale {
    if (typeof window === "undefined") return DEFAULT_LOCALE

    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && stored in translations) return stored

    const browser = navigator.language as Locale
    if (browser in translations) return browser

    const prefix = browser.split("-")[0]
    const match = Object.keys(translations).find((k) => k.startsWith(prefix)) as Locale | undefined
    return match ?? DEFAULT_LOCALE
}

let currentLocale: Locale | null = null
const listeners = new Set<() => void>()

function getSnapshot(): Locale {
    if (currentLocale === null) currentLocale = resolvePreferredLocale()
    return currentLocale
}

function getServerSnapshot(): Locale {
    return DEFAULT_LOCALE
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

function writeLocale(next: Locale): void {
    currentLocale = next
    try {
        localStorage.setItem(STORAGE_KEY, next)
    } catch {
        // localStorage pode estar indisponível (modo privado); o idioma da
        // sessão atual continua valendo.
    }
    listeners.forEach((listener) => listener())
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    const setLocale = useCallback((next: Locale) => {
        writeLocale(next)
    }, [])

    const toggleLocale = useCallback(() => {
        const locales = Object.keys(translations) as Locale[]
        const currentIndex = locales.indexOf(locale)
        writeLocale(locales[(currentIndex + 1) % locales.length])
    }, [locale])

    const value: LanguageContextValue = {
        locale,
        t: translations[locale] as Translations,
        setLocale,
        toggleLocale,
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext)
    if (!ctx) {
        throw new Error("useLanguage must be used inside <LanguageProvider>")
    }
    return ctx
}