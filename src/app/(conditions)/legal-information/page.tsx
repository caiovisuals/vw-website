export default function LegalInformation() {
    return (
        <div className="flex flex-col items-center justify-center gap-12 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="w-full">
                <h1 className="text-4xl font-semibold vw-font">Informações Legais</h1>
                <h3 className="text-xl vw-font">Informações importantes sobre uso, privacidade e segurança.</h3>
            </div>
            <div className="flex flex-col gap-y-3.5 min-w-4xl max-w-6xl">
                <p>
                    Este site foi desenvolvido por um entusiasta da marca Volkswagen, não possuindo vínculo oficial com a empresa. Tanto o desenvolvedor quanto a plataforma buscam seguir as boas práticas, diretrizes e princípios presentes nos termos institucionais e legais da Volkswagen, prezando sempre pela transparência, respeito e segurança dos usuários.
                </p>
                <p>
                    As informações disponibilizadas neste site têm caráter informativo e podem ser atualizadas, modificadas ou removidas a qualquer momento, sem aviso prévio. Apesar dos esforços para manter os dados corretos e atualizados, não garantimos a total precisão, integridade ou atualidade das informações apresentadas.
                </p>
            </div>
        </div>
    )
}