import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/_lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch (err) {
        return NextResponse.json({ error: "Erro ao listar usuários" }, { status: 500 })
    }
}