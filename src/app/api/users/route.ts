import { NextRequest } from "next/server"
import { requireRole } from "@/_lib/utils/session"
import { ok, handleRoute, serverError } from "@/_lib/utils/apiResponse"
import { prisma } from "@/_lib/prisma"

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        await requireRole("STAFF")
        
        try{
            const users = await prisma.user.findMany()
            return ok(users)
        } catch (err) {
            console.error(err)
            return serverError("Erro ao listar usuários")
        }
    })
}