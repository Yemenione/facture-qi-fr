import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Invoicer FR
                        </span>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            La solution de facturation française nouvelle génération, conçue pour simplifier la vie des entrepreneurs et garantir leur conformité.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Produit</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-foreground">Fonctionnalités</Link></li>
                            <li><Link href="#pricing" className="hover:text-foreground">Tarifs</Link></li>
                            <li><Link href="/login" className="hover:text-foreground">Connexion</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Légal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground">Mentions légales</Link></li>
                            <li><Link href="#" className="hover:text-foreground">CGU / CGV</Link></li>
                            <li><Link href="#" className="hover:text-foreground">Politique de confidentialité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Invoicer FR. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
