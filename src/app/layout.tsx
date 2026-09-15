import type { Metadata } from "next"
import { Geologica } from "next/font/google"
import { AuthProvider } from "@/_lib/contexts/AuthContext"
import { LanguageProvider } from "@/_lib/contexts/LanguageContext"
import Script from "next/script"
import ScrollToTop from "@/_components/ScrollToTop"
import "./globals.css"

const geologica = Geologica({
    variable: "--font-geologica",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Volkswagen do Brasil | Hatch, Sedan, SUVW, Picape, Elétrico. Tudo o que você imaginar!",
    description: "Bem-vindo ao website da Volkswagen. Encontre a sua maquina favorita e descubra o melhor do conforto, tecnologia e robustez que somente um Volkswagen oferece.",
    applicationName: "Volkswagen Brasil",
    keywords: [
        "volkswagen", "volks", "volkswagen brasil",
        "caiothedev"
    ],
    openGraph: {
        type: "website",
        locale: "pt_BR",
        alternateLocale: ["en_US","es-ES"],
        url: "/",
        siteName: "Volkswagen do Brasil",
        title: "Volkswagen do Brasil | Carros, SUVs, Picapes e Elétricos",
        description: "Conheça os carros Volkswagen do Brasil e encontre o modelo ideal para você.",
        images: [
            {
                url: "/assets/ogimage.png",
                width: 1200,
                height: 630,
                alt: "Volkswagen do Brasil",
            },
        ],
        countryName: "Brasil",
    },
    twitter: {
        card: "summary_large_image",
        title: "Volkswagen do Brasil | Carros, SUVs, Picapes e Elétricos",
        description: "Conheça os carros Volkswagen do Brasil e encontre o modelo ideal para você.",
        images: ["/assets/ogimage.png"],
        site: "@caioba2007",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
        },
    },
    icons: {
        icon: "/icon.png",
        apple: "/apple-touch-icon.png",
    },
    other: {
        "google": "notranslate",
        "application-name": "Volkswagen Brasil",
        "news_keywords": "caio visuals, vw",
    }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-br" className={`${geologica.variable} h-full antialiased`}>
            <head>
                <Script
                    id="schema-org"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Volkswagen Brasil",
                            "inLanguage": ["pt-BR", "en-US"],
                            "sameAs": [
                                "https://www.facebook.com/volkswagendobrasil",
                                "https://www.instagram.com/volkswagen",
                                "https:/www.youtube.com/@volkswagendobrasil",
                                "https://www.linkedin.com/company/volkswagen-do-brasil",
                                "https://caiothedev.com"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "areaServed": "BR"
                            }
                        })
                    }}
                />
            </head>
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    <LanguageProvider>
                        <ScrollToTop />
                        {children}
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
