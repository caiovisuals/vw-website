import Header from "@/_components/Header"
import Footer from "@/_components/Footer"

export default function UsefulLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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