"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function PrivacyPoliciesSection() {
    const { t } = useLanguage()
    
    return (
        <>
            <div className="w-full">
                <h1 className="text-4xl font-semibold vw-font">{t.conditions.privacyPolicies.title}</h1>
                <h3 className="text-xl vw-font">{t.conditions.privacyPolicies.captions}</h3>
            </div>
            <div className="flex flex-col gap-y-3.5 min-w-4xl max-w-6xl">
                <p>
                    {t.conditions.privacyPolicies.firstParagraph}
                </p>
                <p>
                    {t.conditions.privacyPolicies.secondParagraph}
                </p>
                <p>
                    {t.conditions.privacyPolicies.thirdParagraph}
                </p>
            </div>
        </>
    )
}