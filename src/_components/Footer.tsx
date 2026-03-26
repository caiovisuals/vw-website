import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full flex flex-col bg-[var(--black-background)] text-[var(--white-text)] gap-6 px-6 py-8 md:py-10 md:px-12 lg:px-20">
            <div className="flex flex-row items-start gap-2 justify-between">
                <div className="flex flex-row gap-10 lg:gap-14">
                    <div className="flex flex-col gap-1">
                        <label className="text-xl vw-font">Úteis</label>
                        <Link href="/login" className="hover:text-[var(--white-text-hover)] transition-fast">Logar</Link>
                        <Link href="/register" className="hover:text-[var(--white-text-hover)] transition-fast">Cadastrar</Link>
                        <Link href="/forgot-password" className="hover:text-[var(--white-text-hover)] transition-fast">Esqueci minha Senha</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xl vw-font">Comprar</label>
                        <Link href="/build-your-model" className="hover:text-[var(--white-text-hover)] transition-fast">Monte seu Modelo</Link>
                        <Link href="/dealers" className="hover:text-[var(--white-text-hover)] transition-fast">Concessionárias</Link>
                        <Link href="/sales-and-finance/consortium" className="hover:text-[var(--white-text-hover)] transition-fast">Consórcio</Link>
                        <Link href="/sales-and-finance/finance" className="hover:text-[var(--white-text-hover)] transition-fast">Financiamento</Link>
                        <Link href="/sales-and-finance/pre-owned" className="hover:text-[var(--white-text-hover)] transition-fast">Seminovos</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xl vw-font">Legal</label>
                        <Link href="/legal-information" className="hover:text-[var(--white-text-hover)] transition-fast">Informação Legal</Link>
                        <Link href="/terms-of-use" className="hover:text-[var(--white-text-hover)] transition-fast">Termos de Uso</Link>
                        <Link href="/privacy-policies" className="hover:text-[var(--white-text-hover)] transition-fast">Politicas de Privacidade</Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xl vw-font">Redes Sociais</label>
                        <div className="flex flex-row gap-2.5">
                            <Link href="https://www.instagram.com/volkswagen" target="_blank" className="hover:brightness-75 transition-fast">
                                <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                </svg>
                            </Link>
                            <Link href="https://www.facebook.com/volkswagendobrasil" target="_blank" className="hover:brightness-75 transition-fast">
                                <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="relative size-15">
                    <Image src="/assets/logo-white.png" alt="Volkswagen Logo" fill className="object-cover aspect-square select-none" draggable="false" />
                </div>
            </div>
            <div className="w-full h-0.5 bg-[var(--white-background)]"/>
            <div className="flex flex-row items-center justify-between">
                <span><b>Volkswagen</b> - Feito com carinho e adimiração por{" "}
                    <Link href="https://www.caiovisuals.com" target="_blank" className="hover:opacity-75 transition-fast">
                        <b>Caiovisuals</b>
                    </Link>
                </span>
                <button className="flex flex-row gap-2 items-center justify-center border-2 border-[var(--white-border)] hover:bg-[var(--white-background)]/15 hover:border-[var(--white-border-hover)] px-2.5 py-1.5 rounded-2xl transition-normal cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                    </svg>
                    Portugues - BR
                </button>
            </div>
        </footer>
    )
}
