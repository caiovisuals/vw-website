export type GalleryCategory = "exterior" | "interior" | "detalhes" | "concessionaria"

export type GalleryPhoto = {
    file: string
    alt: string
    category: GalleryCategory
    width: number
    height: number
}

export const galleryCategories: { value: GalleryCategory | null; label: string }[] = [
    { value: null, label: "Todas" },
    { value: "exterior", label: "Exterior" },
    { value: "interior", label: "Interior" },
    { value: "detalhes", label: "Detalhes" },
    { value: "concessionaria", label: "Concessionária" },
]

export const galleryPhotos: GalleryPhoto[] = [
    { file: "cinza de lado.jpg", alt: "Volkswagen cinza de lado", category: "exterior", width: 736, height: 1308 },
    { file: "roda.jpg", alt: "Roda", category: "detalhes", width: 900, height: 1200 },
    { file: "frente azul.jpg", alt: "Volkswagen azul de frente", category: "exterior", width: 736, height: 981 },
    { file: "led de chao.jpg", alt: "LED de chão", category: "detalhes", width: 736, height: 1308 },
    { file: "frota.jpg", alt: "Frota Volkswagen", category: "concessionaria", width: 600, height: 800 },
    { file: "folhas.jpg", alt: "Volkswagen entre as folhas", category: "exterior", width: 1200, height: 2133 },
    { file: "preto de frente.jpg", alt: "Preto de frente", category: "exterior", width: 736, height: 895 },
    { file: "logo grande.jpg", alt: "Logo Volkswagen", category: "concessionaria", width: 736, height: 981 },
    { file: "farol traseiro.jpg", alt: "Farol traseiro", category: "detalhes", width: 1080, height: 1918 },
    { file: "foto na frente da conces.jpg", alt: "Em frente à concessionária", category: "concessionaria", width: 736, height: 1104 },
    { file: "volante.jpg", alt: "Volante", category: "interior", width: 736, height: 736 },
    { file: "barra de led a noite.jpg", alt: "Barra de LED à noite", category: "detalhes", width: 736, height: 981 },
    { file: "painel volante.jpg", alt: "Painel e volante", category: "interior", width: 736, height: 981 },
    { file: "frente.jpg", alt: "Vista frontal", category: "exterior", width: 1200, height: 650 },
    { file: "volante virado.jpg", alt: "Volante virado", category: "interior", width: 736, height: 1308 },
    { file: "lavagem.jpg", alt: "Lavagem", category: "concessionaria", width: 900, height: 1200 },
    { file: "mala ao teto.jpg", alt: "Porta-malas", category: "interior", width: 720, height: 1280 },
    { file: "preto de lado.jpg", alt: "Preto de lado", category: "exterior", width: 736, height: 1104 },
    { file: "painel noite.jpg", alt: "Painel à noite", category: "interior", width: 736, height: 1308 },
    { file: "motor.jpg", alt: "Motor", category: "detalhes", width: 736, height: 920 },
    { file: "lado com led.jpg", alt: "Lateral com LED", category: "exterior", width: 736, height: 1104 },
    { file: "preto.jpg", alt: "Volkswagen preto", category: "exterior", width: 736, height: 1308 },
    { file: "de frete preto.jpg", alt: "Volkswagen preto de frente", category: "exterior", width: 736, height: 725 },
    { file: "painel dia.jpg", alt: "Painel de dia", category: "interior", width: 736, height: 981 },
    { file: "traseira.jpg", alt: "Traseira", category: "exterior", width: 736, height: 1308 },
    { file: "frente preto.jpg", alt: "Frente preta", category: "exterior", width: 1080, height: 1080 },
    { file: "barra traseira.jpg", alt: "Barra traseira", category: "exterior", width: 736, height: 981 },
    { file: "barra de led.jpg", alt: "Barra de LED", category: "detalhes", width: 736, height: 981 },
    { file: "raio x.jpg", alt: "Raio-X", category: "detalhes", width: 621, height: 645 },
    { file: "golf.jpg", alt: "Golf", category: "exterior", width: 736, height: 920 },
    { file: "preto de frente em preto e branco.jpg", alt: "Preto de frente em P&B", category: "exterior", width: 750, height: 1334 },
    { file: "traseira azul.jpg", alt: "Traseira azul", category: "exterior", width: 736, height: 981 },
    { file: "modelo retro.jpg", alt: "Modelo retrô", category: "exterior", width: 1200, height: 1447 },
    { file: "conces.jpg", alt: "Concessionária Volkswagen", category: "concessionaria", width: 736, height: 981 },
    { file: "roda visto de cima.jpg", alt: "Roda vista de cima", category: "detalhes", width: 1200, height: 1800 },
    { file: "chao com led.jpg", alt: "Projeção de LED no chão", category: "detalhes", width: 736, height: 981 },
    { file: "capo aberto.jpg", alt: "Capô aberto", category: "detalhes", width: 736, height: 1104 },
    { file: "painel com luzes vermelhas.jpg", alt: "Painel com luzes vermelhas", category: "interior", width: 736, height: 981 },
    { file: "farol.jpg", alt: "Farol dianteiro", category: "detalhes", width: 736, height: 981 },
    { file: "led.jpg", alt: "Iluminação em LED", category: "detalhes", width: 736, height: 1308 },
]

export const gallerySrc = (file: string) => encodeURI(`/assets/gallery/${file}`)