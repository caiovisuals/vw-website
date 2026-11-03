import { SITE_URL } from "@/_lib/utils/siteUrl"

// Dados estruturados (schema.org) da home. Descrevem o próprio projeto, que é
// independente e não oficial, para que buscadores não o tratem como a
// organização Volkswagen do Brasil.
const organization = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "VW Website",
            alternateName: "VW Website (projeto independente)",
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/assets/logo-blue.png`,
            },
            description:
                "Projeto independente e não oficial inspirado no site da Volkswagen do Brasil, criado por Caio Oliveira para estudo e portfólio. Sem vínculo com a Volkswagen.",
            founder: {
                "@type": "Person",
                name: "Caio Oliveira",
                url: "https://caiothedev.com",
            },
            sameAs: [
                "https://github.com/caiovisuals/vw-website",
                "https://caiothedev.com",
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "VW Website",
            inLanguage: "pt-BR",
            publisher: { "@id": `${SITE_URL}/#organization` },
        },
    ],
}

// Escapa "<" para que nenhum valor feche a tag <script> antes da hora.
const json = JSON.stringify(organization).replace(/</g, "\\u003c")

export default function OrganizationJsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    )
}