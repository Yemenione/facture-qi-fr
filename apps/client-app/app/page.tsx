import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { BentoFeatures } from "@/components/landing/bento-features"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
    return (
        <main className="min-h-screen bg-black selection:bg-indigo-500/30">
            <Navbar />
            <Hero />
            <Stats />
            <BentoFeatures />
            <Testimonials />
            <Pricing />
            <FinalCTA />
            <Footer />
        </main>
    )
}
