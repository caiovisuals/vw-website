# VW WEBSITE - ᴘᴛ

Website institucional, Landing Page e configuração de veículos da Volkswagen do Brasil, desenvolvido com Next.js 16, Prisma, TailwindCSS v4 e autenticação customizada com sessões seguras.
Este é um projeto independente, desenvolvido por um fã da marca para fins de estudo, experimentação e portfólio. Não possui qualquer vínculo oficial com a Volkswagen.

## Capturas de Telas

![Página principal](public/assets/screenshots/1.png)

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

## Como Rodar

Pré-requisitos: **Node.js 20.9+** (recomendado 22) e **PostgreSQL**.

```bash
git clone https://github.com/caiovisuals/vw-website.git
cd vw-website
npm install
cp .env.example .env   # preencha as variáveis (ver abaixo)
npm run db:migrate     # aplica as migrations
npm run db:seed        # popula carros, concessionárias, ofertas e usuários
npm run dev            # http://localhost:3000
```

Usuários criados pelo seed (apenas para desenvolvimento):

| Role | E-mail | Senha |
|---|---|---|
| ADMIN | admin@vwwebsite.dev | Admin1234 |
| STAFF | staff@vwwebsite.dev | Staff1234 |
| USER | cliente@vwwebsite.dev | Cliente1234 |

### Segurança e Autorização

O proxy (`src/proxy.ts`, antigo middleware) só faz um pré-filtro: exige o cookie de sessão em `/home`, `/staff`, `/api/me`, `/api/configurations` e `/api/staff/*`. A validação real da sessão e do papel do usuário acontece no servidor, com `requireAuth` e `requireRole` nas rotas de API e nos layouts de `/home` e `/staff`. Toda requisição que altera dados (`POST`, `PUT`, `PATCH`, `DELETE`) para `/api` precisa do header `x-csrf-token`. No front, use o cliente `api` de `src/_lib/utils/apiClient.ts`, que envia o token automaticamente.

### CI

O workflow `.github/workflows/ci.yml` roda lint, typecheck e testes em todo push para `main` e em todo pull request.

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

## Getting Started

Requirements: **Node.js 20.9+** (22 recommended) and **PostgreSQL**.

```bash
git clone https://github.com/caiovisuals/vw-website.git
cd vw-website
npm install
cp .env.example .env   # fill in the variables (see below)
npm run db:migrate     # apply migrations
npm run db:seed        # seed cars, dealers, offers and users
npm run dev            # http://localhost:3000
```

Seeded users (development only): `admin@vwwebsite.dev` / `Admin1234`, `staff@vwwebsite.dev` / `Staff1234`, `cliente@vwwebsite.dev` / `Cliente1234`.

### Security and Authorization

The proxy (`src/proxy.ts`, formerly middleware) only performs a pre-check: it requires the session cookie on `/home`, `/staff`, `/api/me`, `/api/configurations` and `/api/staff/*`. The actual session and role checks run on the server, through `requireAuth` and `requireRole` in API routes and the `/home` and `/staff` layouts. Every state-changing request (`POST`, `PUT`, `PATCH`, `DELETE`) to `/api` needs the `x-csrf-token` header. On the client, use the `api` helper from `src/_lib/utils/apiClient.ts`, which sends the token automatically.

### CI

The `.github/workflows/ci.yml` workflow runs lint, typecheck and tests on every push to `main` and on every pull request.

## Tests

Unit tests using **Vitest** + Testing Library, located in `src/__tests__/`:

```bash
npm run test            # runs the entire suite
npm run test:coverage   # with coverage
```

Current coverage: API response helpers, authentication utilities, validation schemas (Zod) for cars and auth, suspicious activity detection, and the rate limiting system (limits, tiered blocking, and headers).

by caiothevisual<br/>
#caiobavisuals #volkswagen #nextjs #typescript #prisma #website