export type Locale = "pt-BR" | "en-US"

export const translations = {
    "pt-BR": {
        locale: "pt-BR" as Locale,
        label: "Português - BR",

        header: {
            profileModal: {
                seeProfile: "Ver Perfil",
                LogWithYourAccount: "Entre com a sua conta"
            }
        },

        // Nav
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

        auth: {
            register: {
                title: "Cadastrar",
                caption: "Crie a sua conta de forma simples e fácil",
                inputs: {
                    name: "Nome",
                    email: "Email",
                    password: "Senha",
                    confirmPassword: "Confirmar Senha"
                },
                button: {
                    register: "Criar Conta",
                    loading: "Criando Conta..."
                }
            },
            login: {
                title: "Logar",
                caption: "Faça login com suas credenciais",
                inputs: {
                    email: "Email",
                    password: "Senha",
                },
                button: {
                    login: "Entrar",
                    loading: "Entrando..."
                }
            },
            forgotPassword: {
                title: "Esqueci minha Senha",
                caption: "Troque a sua senha confirmando pelo seu email",
                inputs: {

                },
                button: {
                    forgotPassword: "Enviar Código",
                    loading: "Enviando Código..."
                }
            },
            errors: {

            },
            footerText: {
                agreeTerms: "Ao criar a sua conta, você está declarando estar de acordo com os nossos",
                termsOfUse: "Termos de Uso",
                alreadyHaveAccount: "Já tem uma conta?",
                login: "Faça login",
                noAccount: "Ainda não tem uma conta?",
                register: "Registre-se",
                rememberedYourPassword: "Lembrou sua senha?",
                loginToYourAccount: "Entre na sua Conta"
            }
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

        home: {

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

        conditions:{
            termsOfUse: {
                title: "Termos de Uso",
                captions: "Regras e condições para utilização da plataforma.",
                firstParagraph: "Ao acessar e utilizar esta plataforma, o usuário concorda com os presentes Termos de Uso e compromete-se a respeitar todas as condições aqui estabelecidas. Este site é um projeto independente, desenvolvido com fins educacionais e demonstrativos, não possuindo vínculo oficial com a Volkswagen.",
                secondParagraph: "A plataforma oferece funcionalidades como visualização de veículos, configuração personalizada (incluindo cores, rodas, acabamentos e tecnologias), simulações e interação com conteúdos institucionais. Algumas funcionalidades podem exigir autenticação, sendo o usuário responsável por fornecer informações verídicas e manter a confidencialidade de suas credenciais de acesso.",
                thirdParagraph: "O uso indevido da plataforma, incluindo tentativas de acesso não autorizado, exploração de vulnerabilidades sem aviso prévio, envio de informações falsas ou qualquer atividade que comprometa a integridade do sistema, é estritamente proibido e poderá resultar em bloqueio de acesso.",
                fourthParagraph: "As informações, simulações e configurações apresentadas não possuem valor contratual, podendo sofrer alterações sem aviso prévio. Este site não realiza vendas, transações financeiras ou vínculos comerciais diretos."
            },
            privacyPolicies: {
                title: "Políticas de Privacidade",
                captions: "Como seus dados são coletados, utilizados e protegidos.",
                firstParagraph: "Esta Política de Privacidade descreve como as informações dos usuários são coletadas, utilizadas e protegidas ao utilizar esta plataforma. Ao acessar o site, o usuário concorda com as práticas descritas neste documento.",
                secondParagraph: "Durante a utilização da plataforma, podem ser coletados dados fornecidos diretamente pelo usuário, como nome, e-mail e informações de autenticação, além de dados de navegação, como endereço IP, tipo de dispositivo e interações realizadas no sistema.",
                thirdParagraph: "Esta Política de Privacidade pode ser atualizada periodicamente para refletir melhorias ou alterações legais, sendo recomendada sua revisão regular."
            },
            legalInformation: {
                title: "Informação Legal",
                captions: "Informações importantes sobre uso, privacidade e segurança.",
                firstParagraph: "Este site foi desenvolvido por um entusiasta da marca Volkswagen, não possuindo vínculo oficial com a empresa. Tanto o desenvolvedor quanto a plataforma buscam seguir as boas práticas, diretrizes e princípios presentes nos termos institucionais e legais da Volkswagen, prezando sempre pela transparência, respeito e segurança dos usuários.",
                secondParagraph: "As informações disponibilizadas neste site têm caráter informativo e podem ser atualizadas, modificadas ou removidas a qualquer momento, sem aviso prévio. Apesar dos esforços para manter os dados corretos e atualizados, não garantimos a total precisão, integridade ou atualidade das informações apresentadas."
            }
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

        header: {
            profileModal: {
                seeProfile: "See Profile",
                LogWithYourAccount: "Log in with your account"
            }
        },

        // Nav
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

        auth: {
            register: {
                title: "Register",
                caption: "Create your account in a simple and easy way",
                inputs: {
                    name: "Name",
                    email: "Email",
                    password: "Password",
                    confirmPassword: "Confirm Password"
                },
                button: {
                    register: "Create Account",
                    loading: "Creating Account..."
                }
            },
            login: {
                title: "Login",
                caption: "Log in with your credentials",
                inputs: {
                    email: "Email",
                    password: "Password",
                },
                button: {
                    login: "LogIn",
                    loading: "Logging In..."
                }
            },
            forgotPassword: {
                title: "Forgot Password",
                caption: "Change your password by confirming via email",
                inputs: {

                },
                button: {
                    forgotPassword: "Send Code",
                    loading: "Sending Code..."
                }
            },
            errors: {

            },
            footerText: {
                agreeTerms: "By creating your account, you agree to our",
                termsOfUse: "Terms of Use",
                alreadyHaveAccount: "Already have an account?",
                login: "Log in",
                noAccount: "Don't have an account?",
                register: "Sign up",
                rememberedYourPassword: "Remember your password?",
                loginToYourAccount: "Log in to your account"
            }
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

        home: {

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

        conditions:{
            termsOfUse: {
                title: "Terms of Use",
                captions: "Rules and conditions for using the platform.",
                firstParagraph: "By accessing and using this platform, the user agrees to these Terms of Use and undertakes to respect all the conditions established herein. This website is an independent project, developed for educational and demonstrative purposes, and has no official link with Volkswagen.",
                secondParagraph: "The platform offers features such as vehicle visualization, customized configuration (including colors, wheels, finishes, and technologies), simulations, and interaction with institutional content. Some features may require authentication, and the user is responsible for providing truthful information and maintaining the confidentiality of their access credentials.",
                thirdParagraph: "Misuse of the platform, including attempts at unauthorized access, exploitation of vulnerabilities without prior notice, submission of false information, or any activity that compromises the integrity of the system, is strictly prohibited and may result in access being blocked.",
                fourthParagraph: "The information, simulations, and configurations presented are not contractual and may be subject to change without notice. This website does not conduct sales, financial transactions, or have direct commercial ties."
            },
            privacyPolicies: {
                title: "Privacy Policies",
                captions: "How your data is collected, used, and protected.",
                firstParagraph: "This Privacy Policy describes how user information is collected, used, and protected when using this platform. By accessing the website, the user agrees to the practices described in this document.",
                secondParagraph: "During the use of the platform, data provided directly by the user may be collected, such as name, email, and authentication information, in addition to browsing data, such as IP address, device type, and interactions performed on the system.",
                thirdParagraph: "This Privacy Policy may be updated periodically to reflect improvements or legal changes, and regular review is recommended."
            },
            legalInformation: {
                title: "Legal Information",
                captions: "Important information regarding usage, privacy, and security.",
                firstParagraph: "This website was developed by a Volkswagen enthusiast and has no official affiliation with the company. Both the developer and the platform strive to follow the best practices, guidelines, and principles outlined in Volkswagen's institutional and legal terms, always prioritizing transparency, respect, and user safety.",
                secondParagraph: "The information provided on this website is for informational purposes only and may be updated, modified, or removed at any time without prior notice. Despite our efforts to keep the data accurate and up-to-date, we do not guarantee the complete accuracy, integrity, or timeliness of the information presented."
            }
        },

        notFound: {
            title: "404 Error. We're sorry!",
            description: "The page you are trying to access does not exist or has been removed.",
            backHome: "Back to home",
        },
    },
} satisfies Record<Locale, unknown>

export type Translations = (typeof translations)["pt-BR"]