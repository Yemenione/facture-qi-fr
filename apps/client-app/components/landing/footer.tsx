import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black text-zinc-400">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                I
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">
                                Invoicer FR
                            </span>
                        </Link>
                        <p className="text-sm selection:bg-indigo-500/30 max-w-sm">
                            La plateforme de facturation de référence pour les entrepreneurs français. Conforme, rapide et élégante.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Produit</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#features" className="hover:text-indigo-400 transition-colors">Fonctionnalités</Link></li>
                            <li><Link href="#pricing" className="hover:text-indigo-400 transition-colors">Tarifs</Link></li>
                            <li><Link href="#testimonials" className="hover:text-indigo-400 transition-colors">Témoignages</Link></li>
                            <li><Link href="/register" className="hover:text-indigo-400 transition-colors">Essai gratuit</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Ressources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
                            <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Se connecter</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Légal</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/legal/mentions" className="hover:text-indigo-400 transition-colors">Mentions légales</Link></li>
                            <li><Link href="/legal/cgu" className="hover:text-indigo-400 transition-colors">CGU / CGV</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-indigo-400 transition-colors">Confidentialité</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-indigo-400 transition-colors">RGPD</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} Invoicer FR. Fait avec passion à Paris.</p>
                    <div className="flex gap-4">
                        {/* Social icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
