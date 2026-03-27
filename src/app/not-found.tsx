"use client"

import Link from "next/link"
import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function NotFound() {
    const { t } = useLanguage()

    return (
        <div className="flex flex-col items-center justify-center min-h-[55vh] gap-6 px-6 py-6 md:py-15 lg:py-20 xl:py-35">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-center text-4xl vw-font font-semibold">
                    {t.notFound.title}
                </h1>
                <p className="text-center text-2xl vw-font">
                    {t.notFound.description}
                </p>
            </div>
            <Link
                href="/"
                className="px-5 py-1.5 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-xl transition-normal active:95"
            >
                {t.notFound.backHome}
            </Link>
        </div>
    )
}
