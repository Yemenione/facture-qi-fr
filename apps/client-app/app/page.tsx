import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur Invoicer FR</h1>
            <p className="text-muted-foreground mb-8">Plateforme de facturation conforme 2026.</p>
            <div className="flex gap-4">
                <a href="/dashboard">
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
                        Accéder au Dashboard
                    </button>
                </a>
            </div>
        </main>
    )
}
