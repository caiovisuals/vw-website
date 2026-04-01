import HeroSection from "@/_components/main-page-sections/HeroSection"
import ModelsSection from "@/_components/main-page-sections/ModelsSection"
import FeaturedSection from "@/_components/main-page-sections/FeaturedSection"

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <ModelsSection />
            <FeaturedSection />
        </div>
    )
}
