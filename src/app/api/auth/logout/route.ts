import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/_lib/prisma"
import { SESSION_COOKIE } from "@/_lib/utils/session"
import { ok, handleRoute } from "@/_lib/utils/apiResponse"

export async function POST(req: NextRequest) {
    return handleRoute(async () => {
        const cookieStore = await cookies()
        const token = cookieStore.get(SESSION_COOKIE)?.value

        if (token) {
            await prisma.session.deleteMany({ where: { token } }).catch(() => null)
        }

        const response = ok(null, "Sessão encerrada.")
        response.cookies.set(SESSION_COOKIE, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        })

        return response
    })
}