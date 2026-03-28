import HeroSection from "@/_components/main-page-sections/HeroSection"
import ModelsSection from "@/_components/main-page-sections/ModelsSection"

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <ModelsSection />
        </div>
    )
}
