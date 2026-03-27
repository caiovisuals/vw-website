import { NextResponse } from "next/server"
import { ZodError } from "zod"

export type ApiSuccess<T = unknown> = {
    success: true
    data: T
    message?: string
}

export type ApiError = {
    success: false
    error: string
    fields?: Record<string, string>
}

export function ok<T>(data: T, message?: string, status = 200): NextResponse<ApiSuccess<T>> {
    return NextResponse.json({ success: true, data, message }, { status })
}

export function created<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
    return ok(data, message, 201)
}

export function noContent(): NextResponse<ApiSuccess<null>> {
    return new NextResponse(null, { status: 204 })
}

export function badRequest(error: string, fields?: Record<string, string>): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error, fields }, { status: 400 })
}

export function unauthorized(error = "Não autorizado."): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error }, { status: 401 })
}

export function forbidden(error = "Acesso negado."): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error }, { status: 403 })
}

export function notFound(error = "Recurso não encontrado."): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error }, { status: 404 })
}

export function conflict(error: string): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error }, { status: 409 })
}

export function tooManyRequests(error = "Muitas requisições. Tente novamente mais tarde."): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error }, { status: 429 })
}

export function serverError(error = "Erro interno. Tente novamente."): NextResponse<ApiError> {
    return NextResponse.json({ success: false, error }, { status: 500 })
}

export function fromZodError(err: ZodError): NextResponse<ApiError> {
    const fields: Record<string, string> = {}
    err.issues.forEach((e) => {
        const key = e.path.join(".")
        if (key) fields[key] = e.message
    })
    return badRequest("Dados inválidos.", fields)
}

export async function handleRoute<T>(
    fn: () => Promise<NextResponse<ApiSuccess<T>> | NextResponse<ApiError>>
): Promise<NextResponse<ApiSuccess<T> | ApiError>> {
    try {
        return await fn()
    } catch (err) {
        if (err instanceof ZodError) return fromZodError(err) as NextResponse<ApiError>
        console.error("[API Error]", err)
        return serverError() as NextResponse<ApiError>
    }
}