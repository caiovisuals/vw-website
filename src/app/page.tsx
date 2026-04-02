import HeroSection from "@/_components/main-page-sections/HeroSection"
import ModelsSection from "@/_components/main-page-sections/ModelsSection"
import FeaturedSection from "@/_components/main-page-sections/FeaturedSection"
import ServicesSection from "@/_components/main-page-sections/ServicesSection"

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <ModelsSection />
            <FeaturedSection />
            <ServicesSection />
        </div>
    )
}
