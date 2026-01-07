import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 pt-20">
                <div className="container mx-auto px-4 py-8 max-w-4xl prose prose-slate">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}
