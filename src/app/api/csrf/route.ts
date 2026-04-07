import { NextResponse } from "next/server"
import { getCSRFTokenForClient } from "@/_lib/security/csrf"
 
export async function GET() {
    try {
        const token = await getCSRFTokenForClient()
        return NextResponse.json({ token })
    } catch {
        return NextResponse.json({ token: "" }, { status: 500 })
    }
}