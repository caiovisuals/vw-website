"use client"

import { getCSRFToken, invalidateCSRFCache } from "@/_hooks/useCSRF"

export type ApiResult<T> = {
    ok: boolean
    status: number
    data: T | null
    message?: string
    error?: string
    fields?: Record<string, string>
}

type Body = Record<string, unknown> | undefined

async function request<T>(method: string, url: string, body?: Body): Promise<ApiResult<T>> {
    const needsCSRF = ["POST", "PUT", "PATCH", "DELETE"].includes(method)

    const headers: Record<string, string> = {}
    if (body !== undefined) headers["Content-Type"] = "application/json"
    if (needsCSRF) headers["x-csrf-token"] = await getCSRFToken()

    let res: Response
    try {
        res = await fetch(url, {
            method,
            headers,
            credentials: "include",
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        })
    } catch {
        return { ok: false, status: 0, data: null, error: "Falha de conexão. Verifique sua internet." }
    }

    // Um token CSRF expirado invalida o cache para que a próxima tentativa
    // busque um novo em vez de repetir o mesmo token recusado.
    if (res.status === 403) invalidateCSRFCache()

    if (res.status === 204) {
        return { ok: true, status: res.status, data: null }
    }

    let json: {
        success?: boolean
        data?: T
        message?: string
        error?: string
        fields?: Record<string, string>
    }

    try {
        json = await res.json()
    } catch {
        return {
            ok: false,
            status: res.status,
            data: null,
            error: "Resposta inválida do servidor.",
        }
    }

    return {
        ok: res.ok && json.success !== false,
        status: res.status,
        data: json.data ?? null,
        message: json.message,
        error: json.error,
        fields: json.fields,
    }
}

export const api = {
    get:    <T>(url: string)               => request<T>("GET", url),
    post:   <T>(url: string, body?: Body)  => request<T>("POST", url, body ?? {}),
    patch:  <T>(url: string, body?: Body)  => request<T>("PATCH", url, body ?? {}),
    del:    <T>(url: string)               => request<T>("DELETE", url),
}

export function formatBRL(value: number | string): string {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
    })
}

export function formatDate(value: string | Date): string {
    return new Date(value).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}