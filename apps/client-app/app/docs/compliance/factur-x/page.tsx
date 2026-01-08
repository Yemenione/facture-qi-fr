"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShieldCheck, Lock, FileCode } from "lucide-react";

export default function FacturXPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-12">
                    <Link href="/docs" className="text-zinc-500 hover:text-brand-gold mb-4 inline-block text-sm">← Retour au Centre d'Aide</Link>
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-brand-gold text-black hover:bg-yellow-500">Réforme 2026</Badge>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-700">Légal</Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Tout comprendre sur Factur-X</h1>
                    <p className="text-xl text-zinc-400">La réforme de la facturation électronique expliquée simplement. Pas de panique, nous gérons tout pour vous.</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p>
                        À partir de 2026, l'échange de factures papier ou PDF simple ne sera plus suffisant pour les assujettis à la TVA. Le format standard européen devient le <strong>Factur-X</strong>.
                    </p>

                    <h3 className="text-2xl font-bold text-white mt-12 mb-6">Qu'est-ce que le Factur-X ?</h3>
                    <p className="text-zinc-300">
                        C'est une facture "hybride" qui contient deux visages :
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <FileCode className="w-8 h-8 text-blue-400 mb-4" />
                            <h4 className="font-bold text-white mb-2">1. Pour l'Humain (PDF)</h4>
                            <p className="text-sm text-zinc-400">Un document PDF classique, lisible par vous et vos clients, imprimable si besoin.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <FileCode className="w-8 h-8 text-green-400 mb-4" />
                            <h4 className="font-bold text-white mb-2">2. Pour la Machine (XML)</h4>
                            <p className="text-sm text-zinc-400">Un fichier de données XML invisible attaché au PDF, contenant toutes les infos structurées pour l'administration.</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mt-12 mb-6">Vos Obligations</h3>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                            <span><strong>Réception :</strong> Toutes les entreprises doivent être capables de recevoir des factures électroniques dès 2026.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
                            <span><strong>Émission :</strong> L'obligation d'émettre en Factur-X sera progressive selon la taille de l'entreprise (2026 pour les grandes, 2027 pour les PME/TPE).</span>
                        </li>
                    </ul>

                    <div className="bg-brand-blue/10 border-l-4 border-brand-blue p-6 my-12 rounded-r-xl">
                        <h4 className="text-brand-blue font-bold text-lg mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            La solution ? Ne rien faire.
                        </h4>
                        <p className="text-zinc-300 m-0">
                            Notre plateforme génère <strong>nativement</strong> toutes vos factures au format Factur-X conforme. Vous n'avez aucune manipulation technique à effectuer. Vos factures sont prêtes pour le futur dès aujourd'hui.
                        </p>
                    </div>
                </div>

            </article>
            <Footer />
        </main>
    )
}
