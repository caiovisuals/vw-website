"use client"

import { useLanguage } from "@/_lib/contexts/LanguageContext"

export default function PrivacyPoliciesSection() {
    const { t } = useLanguage()
    
    return (
        <>
            <div className="w-full">
                <h1 className="text-4xl font-semibold vw-font">Políticas de Privacidade</h1>
                <h3 className="text-xl vw-font">Como seus dados são coletados, utilizados e protegidos.</h3>
            </div>
            <div className="flex flex-col gap-y-3.5 min-w-4xl max-w-6xl">
                <p>
                    Esta Política de Privacidade descreve como as informações dos usuários são coletadas, utilizadas e protegidas ao utilizar esta plataforma. Ao acessar o site, o usuário concorda com as práticas descritas neste documento.
                </p>
                <p>
                    Durante a utilização da plataforma, podem ser coletados dados fornecidos diretamente pelo usuário, como nome, e-mail e informações de autenticação, além de dados de navegação, como endereço IP, tipo de dispositivo e interações realizadas no sistema.
                </p>
                <p>
                    Esta Política de Privacidade pode ser atualizada periodicamente para refletir melhorias ou alterações legais, sendo recomendada sua revisão regular.
                </p>
            </div>
        </>
    )
}