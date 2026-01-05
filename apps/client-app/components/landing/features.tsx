import {
    FileCheck,
    ShieldCheck,
    LayoutDashboard,
    Smartphone,
    Mail,
    Users
} from "lucide-react"

const features = [
    {
        name: 'Conformité Totale 2026',
        description: 'Génération automatique de factures au format Factur-X hybride (PDF + XML) conforme à la réforme.',
        icon: FileCheck,
    },
    {
        name: 'Anti-Fraude Certifié',
        description: 'Signature numérique et chaînage cryptographique des factures pour garantir l\'intégrité des données.',
        icon: ShieldCheck,
    },
    {
        name: 'Dashboard Intuitif',
        description: 'Suivez votre chiffre d\'affaires, vos impayés et la TVA en temps réel grâce à des graphiques clairs.',
        icon: LayoutDashboard,
    },
    {
        name: 'Gestion Clients',
        description: 'Annuaire client complet avec remplissage automatique via SIREN et historique de facturation.',
        icon: Users,
    },
    {
        name: 'Relances Automatiques',
        description: 'Ne courez plus après vos paiements. Configurez des emails de relance automatiques et courtois.',
        icon: Mail,
    },
    {
        name: 'Accessible Partout',
        description: 'Une interface responsive pensée pour mobile, tablette et desktop. Facturez où que vous soyez.',
        icon: Smartphone,
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Tout ce dont vous avez besoin pour facturer
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Une plateforme complète conçue pour vous faire gagner du temps et vous assurer la tranquillité d'esprit face à l'administration.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex flex-col p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.name}</h3>
                            <p className="text-muted-foreground leading-relaxed flex-grow">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
