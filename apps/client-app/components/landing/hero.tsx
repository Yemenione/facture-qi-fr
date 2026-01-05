import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
                    <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20">
                    <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#9089fc] to-[#4ac6ff]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
            </div>

            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                    Conforme Loi Finances 2026
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                    La facturation française <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                        simple et conforme
                    </span>
                </h1>

                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-10">
                    Générez des factures Factur-X certifiées, gérez vos clients et suivez vos paiements en toute sérénité. Conçu pour les freelances et PME exigeants.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/register">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg shadow-primary/20">
                            Commencer gratuitement
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg backdrop-blur-sm">
                            Découvrir les fonctionnalités
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Format Factur-X</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Signature Anti-fraude</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Support 7/7</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
