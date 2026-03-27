import { NextRequest } from "next/server"
import { getCurrentUser } from "@/_lib/utils/session"
import { ok, unauthorized, handleRoute } from "@/_lib/utils/apiResponse"

export async function GET(req: NextRequest) {
    return handleRoute(async () => {
        const user = await getCurrentUser()
        if (!user) return unauthorized()
        return ok(user)
    })
}