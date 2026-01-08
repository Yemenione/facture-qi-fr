"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function GettingStartedPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-12">
                    <Link href="/docs" className="text-zinc-500 hover:text-brand-gold mb-4 inline-block text-sm">← Retour au Centre d'Aide</Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Premiers Pas sur votre Espace</h1>
                    <p className="text-xl text-zinc-400">Guide complet pour configurer votre compte et commencer à facturer en moins de 5 minutes.</p>
                </div>

                <div className="space-y-16">
                    {/* Step 1 */}
                    <section className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-bold text-xl shrink-0">1</div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Configuration de l'Identité</h2>
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    La première étape consiste à renseigner les informations légales de votre entreprise. Ces informations apparaîtront sur toutes vos factures (obligatoire).
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {['Numéro SIRET', 'Adresse du Siège Social', 'Numéro de TVA Intracommunautaire', 'Logo de l\'entreprise'].map(item => (
                                        <li key={item} className="flex items-center gap-2 text-zinc-400">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-4 bg-black/30 rounded-lg border border-white/5 text-sm text-zinc-400">
                                    💡 <strong>Astuce :</strong> Vous pouvez modifier ces informations à tout moment dans l'onglet <em>Paramètres > Mon Entreprise</em>.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Step 2 */}
                    <section className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Connexion Bancaire</h2>
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    Pour profiter du rapprochement automatique, connectez votre compte bancaire professionnel. Nous utilisons un partenaire agréé DSP2 (Banque de France) pour une sécurité maximale.
                                </p>
                                <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full">
                                    Voir le guide Rapprochement Bancaire
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Créer votre première facture</h2>
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    Tout est prêt ! Vous pouvez maintenant créer votre première facture. Le système incrémentera automatiquement les numéros de facture pour respecter la chronologie fiscale.
                                </p>
                                <Link href="/docs/tutorials/invoicing">
                                    <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark rounded-full">
                                        Tutoriel : Créer une facture <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-brand-gold/10 rounded-2xl border border-brand-gold/20 text-center">
                    <h3 className="text-2xl font-bold text-brand-gold mb-4">Besoin d'aide pour démarrer ?</h3>
                    <p className="text-white mb-6">Nos experts sont disponibles pour une session de configuration assistée de 15 minutes.</p>
                    <Link href="/contact">
                        <Button className="bg-brand-gold text-brand-dark hover:bg-yellow-500 font-bold px-8 py-6 text-lg rounded-full">
                            Réserver une session offerte
                        </Button>
                    </Link>
                </div>

            </article>

            <Footer />
        </main>
    );
}
