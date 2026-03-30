"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function LegalInformationSection() {
    const { t } = useLanguage()
    
    return (
        <>
            <div className="w-full">
                <h1 className="text-4xl font-semibold vw-font">{t.conditions.legalInformation.title}</h1>
                <h3 className="text-xl vw-font">{t.conditions.legalInformation.captions}</h3>
            </div>
            <div className="flex flex-col gap-y-3.5 min-w-4xl max-w-6xl">
                <p>
                    {t.conditions.legalInformation.firstParagraph}
                </p>
                <p>
                    {t.conditions.legalInformation.secondParagraph}
                </p>
            </div>
        </>
    )
}