import Header from "@/_components/Header"
import Footer from "@/_components/Footer"

export const dynamic = "force-dynamic"

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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