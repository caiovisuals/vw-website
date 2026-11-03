import { redirect } from "next/navigation"
import StaffShell from "@/_components/staff/StaffShell"
import { getCurrentUser } from "@/_lib/utils/session"
import { ROLE_LEVEL } from "@/_lib/utils/sessionConstants"

export const dynamic = "force-dynamic"

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()

    if (!user) redirect("/login?next=/staff")
    if (ROLE_LEVEL[user.role] < ROLE_LEVEL.STAFF) redirect("/")
        
    return <StaffShell>{children}</StaffShell>
}