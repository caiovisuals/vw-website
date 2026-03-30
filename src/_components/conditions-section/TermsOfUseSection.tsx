"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function TermsOfUseSection() {
    const { t } = useLanguage()
    
    return (
        <>
            <div className="w-full">
                <h1 className="text-4xl font-semibold vw-font">{t.conditions.termsOfUse.title}</h1>
                <h3 className="text-xl vw-font">{t.conditions.termsOfUse.captions}</h3>
            </div>
            <div className="flex flex-col gap-y-3.5 min-w-4xl max-w-6xl">
                <p>
                    {t.conditions.termsOfUse.firstParagraph}
                </p>
                <p>
                    {t.conditions.termsOfUse.secondParagraph}
                </p>
                <p>
                    {t.conditions.termsOfUse.thirdParagraph}
                </p>
                <p>
                    {t.conditions.termsOfUse.fourthParagraph}
                </p>
            </div>
        </>
    )
}