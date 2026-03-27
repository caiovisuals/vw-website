import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"

interface UserParams {
    userId: string
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<UserParams> }
) {
    const { userId } = await params
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user)
        return NextResponse.json(
            { error: "Usuário não encontrado" },
            { status: 404 }
        )
        return NextResponse.json(user)
    } catch (err: unknown) {
        return NextResponse.json({ error: "Erro desconhecido" }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<UserParams> }
) {
    const { userId } = await params
    try {
        const body = await req.json()
        const updated = await prisma.user.update({
            where: { id: userId },
            data: body,
        })
        return NextResponse.json(updated)
    } catch (err: unknown) {
        return NextResponse.json({ error: "Erro desconhecido" }, { status: 400 })
    }
}