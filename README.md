# VW WEBSITE - ᴘᴛ

Website institucional, Landing Page e configuração de veículos da Volkswagen do Brasil, desenvolvido com Next.js 16, Prisma, TailwindCSS v4 e autenticação customizada com sessões seguras.
Este é um projeto independente, desenvolvido por um fã da marca para fins de estudo, experimentação e portfólio. Não possui qualquer vínculo oficial com a Volkswagen.

## Capturas de Telas

![Menu Principal](public/assets/screenshots/1.png)

![Modo Solo](public/assets/screenshots/2.png)

![Modo Multiplayer](public/assets/screenshots/3.png)

## Visão Geral
 
O **VW Website** nasceu com o objetivo de recriar e expandir a experiência encontrada no portal oficial da Volkswagen do Brasil, utilizando tecnologias modernas do ecossistema JavaScript para construir uma aplicação full-stack robusta, escalável e próxima de um ambiente corporativo.

Mais do que reproduzir a interface, o projeto busca simular fluxos reais utilizados por grandes empresas do setor automotivo, desde a navegação pelos veículos até autenticação, gerenciamento de usuários, geração de leads e configuração personalizada de automóveis.

Além de servir como desafio técnico, o projeto representa uma homenagem à Volkswagen, demonstrando como uma experiência digital moderna pode ser construída utilizando ferramentas atuais do desenvolvimento web.

A aplicação web full-stack que replica a experiência do site oficial. O projeto cobre:
 
- **Vitrine de modelos** com filtros por combustível e transmissão
- **Configurador de veículos** (cores, rodas, bancos, tecnologias)
- **Localizador de concessionárias** com mapa interativo via Google Maps
- **Sistema de simulação** (para clientes e colaboradores)
- **Sistema completo de autenticação** (registro, login, logout, recuperação de senha)
- **Painel staff/admin** com estatísticas e gerenciamento de usuários e leads
- **API RESTful** completa com validação, rate limiting e controle de acesso por roles
- **Suporte a múltiplos idiomas** (Português BR e English US)

## Tech Stack
 
| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | TailwindCSS v4 |
| ORM | Prisma 6 |
| Banco de Dados | PostgreSQL |
| Autenticação | Sessões customizadas via cookies HTTP-only |
| Validação | Zod 4 |
| Hash de Senha | bcryptjs |
| Mapas | @react-google-maps/api |
| Env Validation | @t3-oss/env-nextjs |
| Fontes | VWHead (custom OTF) + Geologica (Google Fonts) |
| Animações | Framer Motion 12 |

## Objetivos

- Consolidar conhecimentos em desenvolvimento full-stack moderno utilizando Next.js, Prisma e TypeScript
- Construir uma aplicação realista e próxima de um produto corporativo, simulando padrões de mercado
- Desenvolver um sistema completo de autenticação segura com controle de acesso por roles
- Implementar uma API robusta com validação, tratamento de erros e rate limiting
- Trabalhar com internacionalização (i18n) em uma aplicação real
- Explorar integrações externas, como Google Maps, em cenários práticos
- Simular fluxos reais de negócio, como configuração de veículos e geração de leads
- Fortalecer o portfólio com um projeto de alto nível, demonstrando capacidade técnica e atenção a detalhes
- Aumentar visibilidade profissional e criar uma oportunidade de ser notado por empresas como a Volkswagen

## Testes

Testes unitários com **Vitest** + Testing Library, em `src/__tests__/`:

```bash
npm run test            # roda toda a suíte
npm run test:coverage   # com cobertura
```

Cobertura atual: helpers de resposta da API, utilitários de autenticação, schemas de validação (Zod) de carros e auth, detecção de atividade suspeita e o sistema de rate limiting (limites, bloqueio escalonado e headers).

# VW WEBSITE - ᴇɴ

Corporate website, landing page, and vehicle configurator for Volkswagen Brazil, developed using Next.js 16, Prisma, TailwindCSS v4, and custom authentication with secure sessions.
This is an independent project developed by a brand enthusiast for study, experimentation, and portfolio purposes. It has no official affiliation with Volkswagen.

## Overview

The **VW Website** was created with the goal of recreating and expanding upon the experience found on the official Volkswagen Brazil portal, utilizing modern technologies from the JavaScript ecosystem to build a robust, scalable, full-stack application that mirrors a corporate environment.

Beyond merely reproducing the interface, the project seeks to simulate real-world workflows used by major automotive companies—ranging from vehicle browsing and authentication to user management, lead generation, and custom vehicle configuration.

In addition to serving as a technical challenge, the project is a tribute to Volkswagen, demonstrating how a modern digital experience can be built using current web development tools.

A full-stack web application replicating the official site's experience. The project covers:

- **Model showcase** with filters for fuel type and transmission
- **Vehicle configurator** (colors, wheels, seats, technology features)
- **Dealership locator** with an interactive map via Google Maps
- **Simulation system** (for customers and staff)
- **Complete authentication system** (registration, login, logout, password recovery)
- **Staff/admin dashboard** with statistics and user/lead management
- **Full RESTful API** with validation, rate limiting, and role-based access control
- **Multi-language support** (Brazilian Portuguese and US English)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS v4 |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Authentication | Custom sessions via HTTP-only cookies |
| Validation | Zod 4 |
| Password Hashing | bcryptjs |
| Maps | @react-google-maps/api |
| Env Validation | @t3-oss/env-nextjs |
| Fonts | VWHead (custom OTF) + Geologica (Google Fonts) |
| Animations | Framer Motion 12 |

## Objectives

- Consolidate knowledge of modern full-stack development using Next.js, Prisma, and TypeScript
- Build a realistic application resembling an enterprise-grade product, simulating industry standards
- Develop a comprehensive, secure authentication system with role-based access control
- Implement a robust API featuring validation, error handling, and rate limiting
- Work with internationalization (i18n) in a real-world application
- Explore external integrations, such as Google Maps, in practical scenarios
- Simulate real business workflows, such as vehicle configuration and lead generation
- Strengthen my portfolio with a high-level project that demonstrates technical proficiency and attention to detail
- Increase professional visibility and create an opportunity to be noticed by companies like Volkswagen

## Tests

Unit tests using **Vitest** + Testing Library, located in `src/__tests__/`:

```bash
npm run test            # runs the entire suite
npm run test:coverage   # with coverage
```

Current coverage: API response helpers, authentication utilities, validation schemas (Zod) for cars and auth, suspicious activity detection, and the rate limiting system (limits, tiered blocking, and headers).

by caiothevisual<br/>
#caiobavisuals #volkswagen #nextjs #typescript #prisma #website