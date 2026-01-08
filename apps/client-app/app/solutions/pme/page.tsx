"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, ShieldCheck, Users } from "lucide-react"
import Link from "next/link"

export default function PMEPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            {/* HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark">
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-sm font-medium mb-6">
                            <Building2 className="w-4 h-4" /> Pour les PME & TPE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                            Passez à la facturation <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-indigo-400 to-brand-blue">
                                électronique 2026.
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Anticipez la réforme Factur-X. Centralisez vos flux financiers, collaborez avec votre expert-comptable et sécurisez votre trésorerie.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/register?plan=pro">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-brand-blue text-white hover:bg-brand-blue/90 font-bold text-lg shadow-lg shadow-brand-blue/25">
                                    Essayer Pro Gratuitement
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 text-white">
                                    Parler à un expert
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-24 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-blue/30 transition-colors">
                            <ShieldCheck className="w-10 h-10 text-brand-gold mb-6" />
                            <h3 className="text-xl font-bold mb-3">Conformité Factur-X</h3>
                            <p className="text-zinc-400">Générez des factures hybrides (PDF + XML) conformes aux normes Chorus Pro et PPF.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-blue/30 transition-colors">
                            <Users className="w-10 h-10 text-brand-blue mb-6" />
                            <h3 className="text-xl font-bold mb-3">Accès Multi-utilisateurs</h3>
                            <p className="text-zinc-400">Donnez des accès spécifiques à votre équipe (Admin, Vente, Compta) avec gestion des rôles.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-blue/30 transition-colors">
                            <Building2 className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Portail Expert-Comptable</h3>
                            <p className="text-zinc-400">Fini les exports manuels. Votre comptable accède directement à vos pièces et écritures.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="py-20 border-y border-white/5 bg-brand-dark">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">100%</div>
                            <div className="text-zinc-500">Conforme DGI</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">-40%</div>
                            <div className="text-zinc-500">De retards de paiement</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">Secure</div>
                            <div className="text-zinc-500">Chiffrement AES-256</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
