import type { Metadata } from "next"
import { Geologica } from "next/font/google"
import Script from "next/script"
import Header from "@/_components/Header"
import Footer from "@/_components/Footer"
import "./globals.css"

const geologica = Geologica({
    variable: "--font-geologica",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Volkswagen do Brasil | Hatch, Sedan, SUVW, Picape, Elétrico. Tudo o que você imaginar!",
    description: "Bem-vindo ao website da Volkswagen. Encontre a sua maquina favorita e descubra o melhor do conforto, tecnologia e robustez que somente um Volkswagen oferece.",
    keywords: [
        "volkswagen", "volks", "caiovisuals"
    ],
    openGraph: {
        type: "website",
        locale: "pt_BR",
        countryName: "Brasil",
    },
    twitter: {
        card: "summary_large_image",
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
    other: {
        "google": "notranslate",
        "application-name": "Volkswagen Brasil",
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
                            "sameAs": [
                                "https://www.facebook.com/volkswagendobrasil",
                                "https://www.instagram.com/volkswagen",
                                "https://www.youtube.com/@volkswagendobrasil",
                                "https://www.linkedin.com/company/volkswagen-do-brasil"
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
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}
