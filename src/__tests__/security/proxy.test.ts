// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { NextRequest } from "next/server"
import { __resetRateLimitStore } from "@/_lib/security/rateLimit"
import { SESSION_COOKIE } from "@/_lib/utils/sessionConstants"

// `csrfProtection` lê o cookie via `cookies()` de `next/headers`, que só existe
// dentro de uma requisição real do Next. Aqui ele passa a ler os cookies da
// requisição que está sendo testada.
let currentRequest: NextRequest | null = null

vi.mock("next/headers", () => ({
    cookies: async () => ({
        get: (name: string) => currentRequest?.cookies.get(name),
    }),
}))

// Evita a validação de variáveis de ambiente do @t3-oss/env ao importar o csrf.
vi.mock("@/_lib/env", () => ({ env: { NODE_ENV: "test" } }))

const { proxy } = await import("../../../proxy")

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
let ipCounter = 0

type RequestOptions = {
    method?: string
    headers?: Record<string, string>
    cookies?: Record<string, string>
    ip?: string
}

function makeRequest(path: string, options: RequestOptions = {}): NextRequest {
    const headers = new Headers({
        "user-agent": BROWSER_UA,
        // IP único por teste para que o rate limit de um caso não vaze para outro.
        "x-forwarded-for": options.ip ?? `10.0.0.${++ipCounter}`,
        ...options.headers,
    })

    const cookies = Object.entries(options.cookies ?? {})
    if (cookies.length > 0) {
        headers.set("cookie", cookies.map(([k, v]) => `${k}=${v}`).join("; "))
    }

    return new NextRequest(`https://vw.example.com${path}`, {
        method: options.method ?? "GET",
        headers,
    })
}

async function run(req: NextRequest) {
    currentRequest = req
    return proxy(req)
}

function isPassThrough(res: Response) {
    return res.headers.get("x-middleware-next") === "1"
}

beforeEach(() => {
    __resetRateLimitStore()
})

afterEach(() => {
    currentRequest = null
    vi.unstubAllEnvs()
})

describe("proxy: rotas protegidas", () => {
    it.each(["/home", "/home/profile", "/staff", "/staff/users"])(
        "redireciona %s para /login sem cookie de sessão",
        async (path) => {
            const res = await run(makeRequest(path))

            expect(res.status).toBe(307)
            const location = new URL(res.headers.get("location")!)
            expect(location.pathname).toBe("/login")
            expect(location.searchParams.get("next")).toBe(path)
        }
    )

    it("preserva a query string no parâmetro next", async () => {
        const res = await run(makeRequest("/staff/leads?status=NEW"))
        const location = new URL(res.headers.get("location")!)
        expect(location.searchParams.get("next")).toBe("/staff/leads?status=NEW")
    })

    it.each(["/api/me", "/api/configurations", "/api/configurations/ABC123", "/api/staff/stats"])(
        "responde 401 em JSON para %s sem cookie de sessão",
        async (path) => {
            const res = await run(makeRequest(path))

            expect(res.status).toBe(401)
            expect(res.headers.get("content-type")).toContain("application/json")
            expect(await res.json()).toEqual({ success: false, error: "Não autorizado." })
        }
    )

    it("deixa passar rotas protegidas quando há cookie de sessão", async () => {
        const res = await run(makeRequest("/home", { cookies: { [SESSION_COOKIE]: "token" } }))
        expect(isPassThrough(res)).toBe(true)
    })

    it("deixa passar rotas públicas sem cookie de sessão", async () => {
        const res = await run(makeRequest("/api/cars"))
        expect(isPassThrough(res)).toBe(true)
    })

    it("não trata como protegida uma rota que só compartilha o prefixo", async () => {
        const res = await run(makeRequest("/api/meetings"))
        expect(isPassThrough(res)).toBe(true)
    })
})

describe("proxy: headers de segurança", () => {
    it("envia os headers de segurança padrão", async () => {
        const res = await run(makeRequest("/api/cars"))

        expect(res.headers.get("x-content-type-options")).toBe("nosniff")
        expect(res.headers.get("x-frame-options")).toBe("DENY")
        expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin")
        expect(res.headers.get("permissions-policy")).toBe("camera=(), microphone=(), geolocation=(self)")
    })

    it("monta a CSP com o nonce da resposta", async () => {
        const res = await run(makeRequest("/api/cars"))

        const nonce = res.headers.get("x-nonce")
        const csp = res.headers.get("content-security-policy")

        expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/)
        expect(csp).toContain(`'nonce-${nonce}'`)
        expect(csp).toContain("default-src 'self'")
        expect(csp).toContain("frame-src 'none'")
        expect(csp).toContain("object-src 'none'")
        expect(csp).toContain("base-uri 'self'")
    })

    it("repassa o nonce e a CSP para a requisição (para os Server Components)", async () => {
        const res = await run(makeRequest("/api/cars"))

        const nonce = res.headers.get("x-nonce")
        expect(res.headers.get("x-middleware-request-x-nonce")).toBe(nonce)
        expect(res.headers.get("x-middleware-request-content-security-policy"))
            .toBe(res.headers.get("content-security-policy"))
    })

    it("gera um nonce diferente a cada requisição", async () => {
        const a = await run(makeRequest("/api/cars"))
        const b = await run(makeRequest("/api/cars"))
        expect(a.headers.get("x-nonce")).not.toBe(b.headers.get("x-nonce"))
    })

    it("fora de produção: permite 'unsafe-eval' e não envia HSTS", async () => {
        const res = await run(makeRequest("/api/cars"))

        expect(res.headers.get("content-security-policy")).toContain("'unsafe-eval'")
        expect(res.headers.get("strict-transport-security")).toBeNull()
    })

    it("em produção: remove 'unsafe-eval' e envia HSTS", async () => {
        vi.stubEnv("NODE_ENV", "production")
        const res = await run(makeRequest("/api/cars"))

        expect(res.headers.get("content-security-policy")).not.toContain("'unsafe-eval'")
        expect(res.headers.get("strict-transport-security"))
            .toBe("max-age=63072000; includeSubDomains; preload")
    })
})

describe("proxy: CSRF", () => {
    it("bloqueia POST em /api sem token CSRF", async () => {
        const res = await run(makeRequest("/api/leads", { method: "POST" }))
        expect(res.status).toBe(403)
        expect(await res.json()).toEqual({ success: false, error: "Token CSRF inválido." })
    })

    it("bloqueia quando o header não bate com o cookie", async () => {
        const res = await run(makeRequest("/api/leads", {
            method: "POST",
            cookies: { csrf_token: "abc" },
            headers: { "x-csrf-token": "xyz" },
        }))
        expect(res.status).toBe(403)
    })

    it("deixa passar quando o header bate com o cookie", async () => {
        const res = await run(makeRequest("/api/leads", {
            method: "POST",
            cookies: { csrf_token: "abc" },
            headers: { "x-csrf-token": "abc" },
        }))
        expect(isPassThrough(res)).toBe(true)
    })

    it("valida o CSRF antes de checar a sessão", async () => {
        const res = await run(makeRequest("/api/staff/users/1", {
            method: "DELETE",
            cookies: { [SESSION_COOKIE]: "token" },
        }))
        expect(res.status).toBe(403)
    })

    it("não exige token em /api/csrf", async () => {
        const res = await run(makeRequest("/api/csrf", { method: "POST" }))
        expect(isPassThrough(res)).toBe(true)
    })
})

describe("proxy: bloqueios", () => {
    it("bloqueia user agents de scanners conhecidos", async () => {
        const res = await run(makeRequest("/api/cars", { headers: { "user-agent": "sqlmap/1.7.2" } }))
        expect(res.status).toBe(403)
        expect(await res.json()).toEqual({ success: false, error: "Requisição bloqueada." })
    })

    it("aplica o rate limit de autenticação (15 requisições)", async () => {
        const ip = "203.0.113.10"
        for (let i = 0; i < 15; i++) {
            const res = await run(makeRequest("/api/auth/login", { ip }))
            expect(res.status).not.toBe(429)
        }

        const res = await run(makeRequest("/api/auth/login", { ip }))
        expect(res.status).toBe(429)
        expect(res.headers.get("retry-after")).not.toBeNull()
        expect(res.headers.get("x-ratelimit-limit")).toBe("15")
    })

    it("aplica o rate limit geral da API (100 requisições)", async () => {
        const ip = "203.0.113.20"
        for (let i = 0; i < 100; i++) {
            await run(makeRequest("/api/cars", { ip }))
        }

        const res = await run(makeRequest("/api/cars", { ip }))
        expect(res.status).toBe(429)
        expect(res.headers.get("x-ratelimit-limit")).toBe("100")
    })
})