import HeroSection from "@/_components/mainpagesections/HeroSection"
import ModelsSection from "@/_components/mainpagesections/ModelsSection"

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <ModelsSection />
        </div>
    )
}
