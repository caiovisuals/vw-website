"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
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

function resolveInitialLocale(): Locale {
    if (typeof window === "undefined") return DEFAULT_LOCALE

    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && stored in translations) return stored

    const browser = navigator.language as Locale
    if (browser in translations) return browser

    const prefix = browser.split("-")[0]
    const match = Object.keys(translations).find((k) => k.startsWith(prefix)) as Locale | undefined
    return match ?? DEFAULT_LOCALE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale())

    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next)
        localStorage.setItem(STORAGE_KEY, next)
        document.documentElement.lang = next
    }, [])

    const toggleLocale = useCallback(() => {
        const locales = Object.keys(translations) as Locale[]
        const currentIndex = locales.indexOf(locale)
        const next = locales[(currentIndex + 1) % locales.length]
        setLocale(next)
    }, [locale, setLocale])

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