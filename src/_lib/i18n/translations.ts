export type Locale = "pt-BR" | "en-US"

export const translations = {
    "pt-BR": {
        locale: "pt-BR" as Locale,
        label: "Português - BR",

        // Header / Nav
        nav: {
            login: "Logar",
            register: "Cadastrar",
            forgotPassword: "Esqueci minha Senha",
            logout: "Sair",
            buildYourModel: "Monte seu Modelo",
            dealers: "Concessionárias",
            consortium: "Consórcio",
            finance: "Financiamento",
            preOwned: "Seminovos",
            legalInformation: "Informação Legal",
            termsOfUse: "Termos de Uso",
            privacyPolicies: "Políticas de Privacidade",
            home: "Início",
            profile: "Perfil",
        },

        // Footer
        footer: {
            useful: "Úteis",
            buy: "Comprar",
            legal: "Legal",
            socialMedia: "Redes Sociais",
            madeWith: "Feito com carinho e admiração por",
        },

        hero: {
            nivus: {
                title: "O novo Nivus",
                subtitle: "Conectividade, design e um looping de emoções. Com novas tecnologias e agora conectado!",
            },
            taos: {
                title: "Um carro com superpoderes",
                subtitle: "O SUVW com nota máxima em segurança e interna superconfortável.",
            },
            polo: {
                title: "Mais que um carro, um Polo",
                subtitle: "Um Volks para você conduzir com mais estilo pelas ruas.",
            },
        },

        // Build Your Model page
        buildYourModel: {
            title: "Monte seu Modelo",
            noResults: "Sentimos muito.",
            noResultsDescription: "Nenhum modelo encontrado com esses filtros.",
            showMoreFilters: "Exibir mais Filtros",
            filters: "Filtros",
            fuel: "Combustível",
            transmission: "Transmissão",
            flex: "Flex",
            electric: "Elétrico",
            manual: "Manual",
            automatic: "Automático",
            apply: "Aplicar",
            clear: "Limpar",
            filtersTitle: "Filtros",
        },

        // Setting page
        setting: {
            technicalData: "Ver dados técnicos",
            colors: "Cores",
            wheels: "Rodas",
            interior: "Interior",
            seats: "Bancos",
            technology: "Tecnologia",
            basePrice: "Preço Base",
            customizedPrice: "Seu Preço Customizado",
            contactDealer: "Contatar Concessionária VW",
            save: "Salvar",
            createCode: "Criar código de customização",
            priceDisclaimer:
                "Os valores não incluem frete doméstico. Preços públicos sugeridos. Valores válidos para versões básicas. Consulte um revendedor sobre a disponibilidade de sua configuração.",
        },

        notFound: {
            title: "Erro 404. Sentimos muito!",
            description: "A página que você está tentando acessar não existe ou foi removida.",
            backHome: "Voltar para o início",
        },
    },

    "en-US": {
        locale: "en-US" as Locale,
        label: "English - US",

        // Header / Nav
        nav: {
            login: "Login",
            register: "Register",
            forgotPassword: "Forgot my Password",
            logout: "Logout",
            buildYourModel: "Build Your Model",
            dealers: "Dealers",
            consortium: "Consortium",
            finance: "Financing",
            preOwned: "Pre-Owned",
            legalInformation: "Legal Information",
            termsOfUse: "Terms of Use",
            privacyPolicies: "Privacy Policies",
            home: "Home",
            profile: "Profile",
        },

        // Footer
        footer: {
            useful: "Useful",
            buy: "Buy",
            legal: "Legal",
            socialMedia: "Social Media",
            madeWith: "Made with love and admiration by",
        },

        hero: {
            nivus: {
                title: "The new Nivus",
                subtitle: "Connectivity, design, and a loop of emotions. With new technologies and now connected!",
            },
            taos: {
                title: "A car with superpowers",
                subtitle: "The SUVW with top safety rating and super comfortable interior space.",
            },
            polo: {
                title: "More than a car, a Polo",
                subtitle: "A Volks for you to drive with more style through the streets.",
            },
        },

        // Build Your Model page
        buildYourModel: {
            title: "Build Your Model",
            noResults: "We're sorry.",
            noResultsDescription: "No models found with these filters.",
            showMoreFilters: "Show More Filters",
            filters: "Filters",
            fuel: "Fuel",
            transmission: "Transmission",
            flex: "Flex",
            electric: "Electric",
            manual: "Manual",
            automatic: "Automatic",
            apply: "Apply",
            clear: "Clear",
            filtersTitle: "Filters",
        },

        // Setting page
        setting: {
            technicalData: "View technical data",
            colors: "Colors",
            wheels: "Wheels",
            interior: "Interior",
            seats: "Seats",
            technology: "Technology",
            basePrice: "Base Price",
            customizedPrice: "Your Customized Price",
            contactDealer: "Contact VW Dealer",
            save: "Save",
            createCode: "Create customization code",
            priceDisclaimer:
                "Prices do not include domestic shipping. Suggested public prices. Prices valid for base versions. Consult a dealer for the availability of your configuration.",
        },

        notFound: {
            title: "404 Error. We're sorry!",
            description: "The page you are trying to access does not exist or has been removed.",
            backHome: "Back to home",
        },
    },
} satisfies Record<Locale, unknown>

export type Translations = (typeof translations)["pt-BR"]