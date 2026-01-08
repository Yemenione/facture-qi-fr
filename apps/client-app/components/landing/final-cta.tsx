"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function FinalCTA() {
    return (
        <section className="relative py-24 bg-brand-dark overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-brand-blue/20 via-brand-gold/10 to-transparent rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        <span className="text-sm text-zinc-300">Essai gratuit de 14 jours • Sans carte bancaire</span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                        Prêt à simplifier votre{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">
                            facturation ?
                        </span>
                    </h2>

                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                        Rejoignez des milliers d'entrepreneurs qui ont déjà fait le choix de l'excellence avec Invoicer FR.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg rounded-full bg-brand-gold text-brand-dark hover:bg-yellow-400 font-bold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)]"
                            >
                                Commencer gratuitement
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all hover:scale-105"
                            >
                                Voir les tarifs
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Sans engagement</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Conforme 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Support 24/7</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
