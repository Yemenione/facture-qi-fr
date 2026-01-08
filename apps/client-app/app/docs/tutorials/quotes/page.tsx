"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

export default function QuotesTutorialPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-12">
                    <Link href="/docs" className="text-zinc-500 hover:text-brand-gold mb-4 inline-block text-sm">← Retour au Centre d'Aide</Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Gérer les Devis & Avoirs</h1>
                    <p className="text-xl text-zinc-400">Apprenez à transformer un devis en facture et à gérer les avoirs en quelques clics.</p>
                </div>

                <div className="grid gap-12">
                    {/* Step 1 */}
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Créer un Devis</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Le processus est identique à la création d'une facture. Sélectionnez simplement le type <strong>"Devis"</strong> lors de la création. Vous pouvez l'envoyer par email pour signature électronique.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. Transformer en Facture</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Une fois le devis accepté par le client, ouvrez-le et cliquez sur <strong>"Convertir en Facture"</strong>. Toutes les informations sont reprises automatiquement.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Créer un Avoir</h2>
                        </div>
                        <p className="text-zinc-400 pl-16 mb-4">
                            Pour annuler une facture ou rembourser un client, ouvrez la facture concernée et sélectionnez <strong>"Créer un Avoir"</strong> dans le menu d'actions. L'avoir sera automatiquement lié à la facture d'origine.
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <p className="text-zinc-500 text-sm">Prochain guide</p>
                        <p className="font-bold text-white text-lg">Gérer vos Clients</p>
                    </div>
                    <Link href="/docs/tutorials/clients">
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
