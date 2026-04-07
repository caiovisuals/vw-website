import Header from "@/_components/Header"
import HeroSection from "@/_components/main-page-sections/HeroSection"
import ModelsSection from "@/_components/main-page-sections/ModelsSection"
import FeaturedSection from "@/_components/main-page-sections/FeaturedSection"
import ServicesSection from "@/_components/main-page-sections/ServicesSection"
import Footer from "@/_components/Footer"

export default function Home() {
    return (
        <>
            <Header />
            <HeroSection />
            <ModelsSection />
            <FeaturedSection />
            <ServicesSection />
            <Footer />
        </>
    )
}
