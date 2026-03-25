import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Volkswagen do Brasil | Hatch, Sedan, SUVW, Picape, Elétrico. Tudo o que você imaginar!",
    description: "Bem-vindo ao website da Volkswagen. Encontre a sua maquina favorita e descubra o melhor do conforto, tecnologia e robustez que somente um Volkswagen oferece.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-br" className={`${geistMono.variable} h-full antialiased`}>
           <body className="min-h-full flex flex-col">{children}</body>
        </html>
    )
}
