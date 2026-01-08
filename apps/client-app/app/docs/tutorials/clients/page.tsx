"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Search, History, ArrowRight } from "lucide-react";

export default function ClientsTutorialPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-12">
                    <Link href="/docs" className="text-zinc-500 hover:text-brand-gold mb-4 inline-block text-sm">← Retour au Centre d'Aide</Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Gestion des Clients (CRM)</h1>
                    <p className="text-xl text-zinc-400">Centralisez toutes les informations de vos clients et suivez leur historique.</p>
                </div>

                <div className="grid gap-12">
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Le Fichier Client</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Accédez à la liste de vos clients depuis le menu principal. Vous pouvez importer une liste existante (CSV/Excel) ou ajouter des clients manuellement.
                        </p>
                    </div>

                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <Search className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Remplissage Automatique</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Saisissez simplement le numéro SIRET ou le nom de l'entreprise : nous récupérons automatiquement l'adresse et les informations légales via l'API INSEE.
                        </p>
                    </div>

                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <History className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Historique & Suivi</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Sur chaque fiche client, retrouvez l'historique complet des factures, devis, le chiffre d'affaires généré et le délai moyen de paiement.
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <p className="text-zinc-500 text-sm">Prochain guide</p>
                        <p className="font-bold text-white text-lg">Mon Compte</p>
                    </div>
                    <Link href="/docs/account">
                        <Button variant="ghost" className="text-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold">
                            Suivant <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

            </article>
            <Footer />
        </main>
    )
}
