import Header from "@/_components/Header"
import Footer from "@/_components/Footer"

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col">
            <Header />
            {children}
            <Footer />
        </div>
    )
}