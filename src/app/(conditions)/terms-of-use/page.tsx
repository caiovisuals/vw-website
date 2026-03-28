export default function TermsOfUse() {
    return (
        <div className="flex flex-col items-center justify-center gap-12 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="w-full">
                <h1 className="text-4xl font-semibold vw-font">Termos de Uso</h1>
                <h3 className="text-xl vw-font">Regras e condições para utilização da plataforma.</h3>
            </div>
            <div className="flex flex-col gap-y-3.5 min-w-4xl max-w-6xl">
                <p>
                    Ao acessar e utilizar esta plataforma, o usuário concorda com os presentes Termos de Uso e compromete-se a respeitar todas as condições aqui estabelecidas. Este site é um projeto independente, desenvolvido com fins educacionais e demonstrativos, não possuindo vínculo oficial com a Volkswagen.
                </p>
                <p>
                    A plataforma oferece funcionalidades como visualização de veículos, configuração personalizada (incluindo cores, rodas, acabamentos e tecnologias), simulações e interação com conteúdos institucionais. Algumas funcionalidades podem exigir autenticação, sendo o usuário responsável por fornecer informações verídicas e manter a confidencialidade de suas credenciais de acesso.
                </p>
                <p>
                    O uso indevido da plataforma, incluindo tentativas de acesso não autorizado, exploração de vulnerabilidades sem aviso prévio, envio de informações falsas ou qualquer atividade que comprometa a integridade do sistema, é estritamente proibido e poderá resultar em bloqueio de acesso.
                </p>
                <p>
                    As informações, simulações e configurações apresentadas não possuem valor contratual, podendo sofrer alterações sem aviso prévio. Este site não realiza vendas, transações financeiras ou vínculos comerciais diretos.
                </p>
            </div>
        </div>
    )
}