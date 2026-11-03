import Header from "@/_components/Header"
import Footer from "@/_components/Footer"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/_lib/utils/session"

export const dynamic = "force-dynamic"

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const user = await getCurrentUser()
    if (!user) redirect("/login?next=/home")
        
    return (
        <div className="flex flex-col">
            <Header />
            <div className="min-h-[100vh]">
                {children}
            </div>
            <Footer />
        </div>
    )
}