"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Plus, Send, ArrowRight } from "lucide-react";

export default function InvoicingTutorialPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-12">
                    <Link href="/docs" className="text-zinc-500 hover:text-brand-gold mb-4 inline-block text-sm">← Retour au Centre d'Aide</Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Créer une Facture en 30 secondes</h1>
                    <p className="text-xl text-zinc-400">Découvrez comment générer des factures professionnelles et conformes Factur-X sans effort.</p>
                </div>

                <div className="grid gap-12">
                    {/* Step 1 */}
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Nouvelle Facture</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Depuis votre tableau de bord, cliquez sur le bouton principal <strong>"Nouveau Document"</strong> ou appuyez sur la touche <kbd className="bg-white/10 px-2 py-0.5 rounded text-xs text-zinc-300 font-mono">N</kbd> de votre clavier.
                        </p>
                        <div className="pl-16">
                            <div className="aspect-[3/1] bg-gradient-to-br from-brand-blue/20 to-brand-dark rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-brand-blue/30 font-bold text-lg uppercase tracking-widest">Capture d'écran de l'interface</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Saisie Intelligente</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Sélectionnez un client existant ou créez-en un nouveau en un clic (remplissage automatique via SIRET). Ajoutez vos prestations ou produits. Le calcul de la TVA et des totaux est automatique.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <Send className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Finalisation & Envoi</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Cliquez sur <strong>"Valider"</strong>. La facture est signée électroniquement et peut être envoyée par email directement au client, avec un lien de paiement sécurisé.
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <p className="text-zinc-500 text-sm">Prochain tutoriel</p>
                        <p className="font-bold text-white text-lg">Comprendre Factur-X</p>
                    </div>
                    <Link href="/docs/compliance/factur-x">
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
