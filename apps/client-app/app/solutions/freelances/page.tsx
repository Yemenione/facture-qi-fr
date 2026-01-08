"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FreelancePage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            {/* HER0 SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
                            <Zap className="w-4 h-4" /> Spécial Indépendants
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                            Ne perdez plus 1h <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">
                                sur vos factures.
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-2xl">
                            La solution de facturation conçue pour les freelances qui veulent être payés rapidement, sans paperasse inutile. 100% Conforme Auto-entrepreneur.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register?plan=free">
                                <Button size="lg" className="h-14 px-8 rounded-full bg-brand-gold text-brand-dark hover:bg-yellow-400 font-bold text-lg">
                                    Commencer Gratuitement
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* PAIN POINTS / FEATURES */}
            <section className="py-20 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Édition Ultra-Rapide</h3>
                            <p className="text-zinc-400">Créez une facture en 30 secondes chrono. Vos clients sont enregistrés, vos prestations aussi.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Mobile First</h3>
                            <p className="text-zinc-400">Envoyez vos factures depuis votre téléphone, dans le métro ou chez le client.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Mentions Légales Auto</h3>
                            <p className="text-zinc-400">TVA non applicable, Art. 293B ? Nous gérons toutes les mentions obligatoires.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA STRIP */}
            <section className="py-32 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-heading font-bold mb-8">Rejoignez 2,500+ Indépendants</h2>
                    <Link href="/register">
                        <Button size="lg" className="rounded-full bg-white text-brand-dark hover:bg-zinc-200 font-bold">
                            Créer mon compte
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
