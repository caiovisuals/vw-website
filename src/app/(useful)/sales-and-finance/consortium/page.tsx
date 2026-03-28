"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Consortium() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <div className="flex flex-col items-center justify-center gap-16 px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-15">
            <div className="w-full">
                <h1 className="text-2xl lg:text-3xl font-semibold vw-font">O seu Consórcio Volkswagen está aqui</h1>
                <h3 className="text-xl vw-font">Mais de 700 mil carros, 700 mil histórias</h3>
            </div>
            <section className="flex flex-col gap-6 items-center justify-center max-w-400">
                <h1 className="text-center text-2xl vw-font max-w-150">O carro que você sempre sonhou, <span className="font-semibold">com parcelas que você nunca imaginou.</span></h1>
                <ul className="grid grid-cols-3 gap-4">
                    <div role="option" className="flex-shrink-0 snap-start group relative flex flex-col items-center gap-3 rounded-2xl py-5 px-2.5 cursor-pointer">   
                        <div>
                            <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#BCBCBC_0%,_#999999_100%)] rounded-2xl transition-normal z-8" />
                            <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)] group-hover:opacity-0 rounded-2xl transition-normal z-9" />
                        </div>
                        <Image src="/assets/cars/polo.webp" alt="Polo" className="w-full h-40 lg:h-50 group-hover:scale-105 group-active:scale-95 object-contain transition-normal z-11 select-none" width={864} height={432} draggable="false" />
                        <div>
                            <h2 className="text-xl font-semibold text-center">Consórcio Polo</h2>
                            <h2 className="text-lg">Parcelas a partir de <span className="font-semibold">R$ 1.228,13</span></h2>
                        </div>
                        <Link href="" className="px-8 py-1.5 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-2xl transition-normal active:95 w-fit scale-y-95 translate-y-2 hover:scale-y-100 group-hover:translate-y-0">
                            Simule Aqui
                        </Link>
                    </div>
                    <div role="option" className="flex-shrink-0 snap-start group relative flex flex-col items-center gap-3 rounded-2xl py-5 px-2.5 cursor-pointer">   
                        <div>
                            <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#BCBCBC_0%,_#999999_100%)] rounded-2xl transition-normal z-8" />
                            <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)] group-hover:opacity-0 rounded-2xl transition-normal z-9" />
                        </div>
                        <Image src="/assets/cars/nivus.webp" alt="Nivus" className="w-full h-40 lg:h-50 group-hover:scale-105 group-active:scale-95 object-contain transition-normal z-11 select-none" width={864} height={432} draggable="false" />
                        <div>
                            <h2 className="text-xl font-semibold text-center">Consórcio Nivus</h2>
                            <h2 className="text-lg">Parcelas a partir de <span className="font-semibold">R$ 1.767,19</span></h2>
                        </div>
                        <Link href="" className="px-8 py-1.5 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-2xl transition-normal active:95 w-fit scale-y-95 translate-y-2 hover:scale-y-100 group-hover:translate-y-0">
                            Simule Aqui
                        </Link>
                    </div>
                    <div role="option" className="flex-shrink-0 snap-start group relative flex flex-col items-center gap-3 rounded-2xl py-5 px-2.5 cursor-pointer">   
                        <div>
                            <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#BCBCBC_0%,_#999999_100%)] rounded-2xl transition-normal z-8" />
                            <div className="absolute inset-0 w-full h-[50%] lg:h-[58%] bg-[radial-gradient(circle,_#CCCECE_0%,_#AFAFAF_100%)] group-hover:opacity-0 rounded-2xl transition-normal z-9" />
                        </div>
                        <Image src="/assets/cars/jetta.webp" alt="Jetta" className="w-full h-40 lg:h-50 group-hover:scale-105 group-active:scale-95 object-contain transition-normal z-11 select-none" width={864} height={432} draggable="false" />
                        <div>
                            <h2 className="text-xl font-semibold text-center">Consórcio Jetta</h2>
                            <h2 className="text-lg">Parcelas a partir de <span className="font-semibold">R$ 1.897,56</span></h2>
                        </div>
                        <Link href="" className="px-8 py-1.5 text-[var(--white-text)] bg-[var(--dark-blue)] hover:bg-[var(--medium-blue)] rounded-2xl transition-normal active:95 w-fit scale-y-95 translate-y-2 hover:scale-y-100 group-hover:translate-y-0">
                            Simule Aqui
                        </Link>
                    </div>
                </ul>
            </section>
            <section className="w-full flex flex-col-reverse lg:flex-row items-stretch justify-center gap-8 md:max-w-5xl xl:max-w-6xl">
                <div className="w-full lg:w-[50%] flex flex-col gap-6 justify-between h-full">
                    <h2 className="text-3xl md:text-4xl vw-font">O que é <span className="font-semibold">consórcio?</span></h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        <svg className="flex-shrink-0" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
                        </svg>
                        <p>O consórcio nada mais é do que uma modalidade de investimento segura e mais barata para programar a compra do seu automóvel de forma parcelada e sem juros.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        <svg className="flex-shrink-0" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>                        </svg>
                        <p>Trata-se de tipo de crédito em que pessoas (físicas ou jurídicas) se juntam colaborativamente em um grupo para comprar um bem de interesse comum (carro novo, seminovo, usado, caminhões), cujos prazos e valores são determinados de acordo com o plano e percentual.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        <svg className="flex-shrink-0" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/><path d="M16 10h.01"/><path d="M2 8v1a2 2 0 0 0 2 2h1"/>
                        </svg>
                        <p>No consórcio, todos os participantes têm a mesma chance de adquirir seu bem por sorteio ou lance, uma vez que cada um se compromete a honrar suas parcelas, contribuindo para que todos realizem o sonho de um carro novo na garagem.</p>
                    </div>
                </div>
                <div className="w-full lg:w-[50%] relative min-h-[300px] lg:min-h-full lg:w-[50rem]">
                    <Image src="/assets/consortium/t-cross-photo.webp" alt="Jetta" className="object-cover select-none" fill draggable="false" />
                </div>
            </section>
            <section className="flex flex-col gap-6 items-center justify-center">
                <h2 className="text-3xl md:text-4xl vw-font">Vantagens do <span className="font-semibold">Consórcio Volkswagen</span></h2>
                <div className="grid md:grid-cols-3 max-w-6xl gap-4">
                    <div className="flex h-48 lg:h-64 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 size-12">
                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                        </svg>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold vw-font">Sonho sem burocracia</span>
                            <span>Tudo no seu tempo e do seu jeito. Flexibilidade máxima nos planos.</span>
                        </div>
                    </div>
                    <div className="flex h-48 lg:h-64 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 size-12">
                            <path d="M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="m17 17 5 5"/><path d="M18 12h.01"/><path d="m22 17-5 5"/><path d="M6 12h.01"/><circle cx="12" cy="12" r="2"/>
                        </svg>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold vw-font">Sem juros</span>
                            <span>Sem letras miúdas, sem entrada e sem taxa de adesão.</span>
                        </div>
                    </div>
                    <div className="flex h-48 lg:h-64 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 size-12">
                            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold vw-font">No seu tempo</span>
                            <span>Liberdade para antecipar suas parcelas e quitar seu automóvel.</span>
                        </div>
                    </div>
                    <div className="flex h-48 lg:h-64 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 size-12">
                            <path d="M12 2v2"/><path d="M15.726 21.01A2 2 0 0 1 14 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2"/><path d="M18 2v2"/><path d="M2 13h2"/><path d="M8 8h14"/><rect x="8" y="3" width="14" height="14" rx="2"/>
                        </svg>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold vw-font">Parcelas que cabem no seu porta-luvas</span>
                            <span>Tendo até 100 meses para quitar seu consórcio.</span>
                        </div>
                    </div>
                    <div className="flex h-48 lg:h-64 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 size-12">
                            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>
                        </svg>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold vw-font">Dinheiro na mão</span>
                            <span>Com a carta de crédito, você compra seu carro à vista.</span>
                        </div>
                    </div>
                    <div className="flex h-48 lg:h-64 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 size-12">
                            <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
                       </svg>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold vw-font">Planejamento do seu jeito</span>
                            <span>Escolha o modelo e os detalhes alinhados ao seu orçamento.</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col md:flex-row gap-8 items-start justify-center md:max-w-5xl xl:max-w-6xl">
                <div className="w-full md:w-[50%]">
                    <h2 className="text-3xl md:text-4xl vw-font">Restou alguma <span className="font-semibold">dúvida?</span></h2>
                    <h3 className="text-lg vw-font">Tudo o que você precisa saber sobre os consórcios.</h3>
                </div>
                <div className="w-full md:w-[50%] flex flex-col gap-2">
                    <div onClick={() => toggleFAQ(0)} className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-row items-center justify-between gap-3">
                            <p className="text-lg">Quem é o Consórcio Volkswagen?</p>
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${activeIndex === 0 ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${activeIndex === 0 ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                        </div>
                        <div className={`overflow-hidden transition-normal ${activeIndex === 0 ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                            <p>O Consórcio Volkswagen é uma administradora de consórcio dos veículos Volkswagen.</p>
                        </div>
                    </div>
                    <div onClick={() => toggleFAQ(1)} className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-row items-center justify-between gap-3">
                            <p className="text-lg">É seguro comprar consórcio?</p>
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${activeIndex === 1 ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${activeIndex === 1 ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                        </div>
                        <div className={`overflow-hidden transition-normal ${activeIndex === 1 ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                            <p>Sim! Quando você escolher um plano de consórcio que se ajuste às suas necessidades, juntaremos você a um grupo de pessoas que buscam créditos similares ao seu (pode haver valores até 50% maiores ou menores).</p>
                        </div>
                    </div>
                    <div onClick={() => toggleFAQ(2)} className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-row items-center justify-between gap-3">
                            <p className="text-lg">Quais as vantagens de comprar um consórcio de carros?</p>
                            <div className={`relative size-[16px]`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${activeIndex === 2 ? "opacity-0 rotate-45" : "opacity-100 rotate-0"}`}>
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`absolute transition-normal ${activeIndex === 2 ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}>
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                        </div>
                        <div className={`overflow-hidden transition-normal ${activeIndex === 2 ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                            <p>O consórcio de carros chama a atenção de investidores pacientes, isso porque é a maneira mais vantajosa, barata e segura do mercado para adquirir um veículo. Aliás, o carro dos seus sonhos é bem acessível com essa modalidade. Quer mais vantagens de adquirir um Consórcio Volkswagen?</p>
                            <ul className="ml-10">
                                <li>Parcelas que cabem no seu porta-luvas sem juros e sem taxa de adesão</li>
                                <li>Maior garantia para o seu investimento</li>
                                <li>Compra planejada</li>
                                <li>Parcelamento integral do crédito com planos flexíveis</li>
                                <li>Valor do bem atualizado</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}