"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles } from "lucide-react"

const plans = [
    {
        name: "Gratuit",
        price: "0",
        description: "Parfait pour démarrer",
        features: [
            "5 factures par mois",
            "1 client",
            "Export PDF",
            "Support email",
            "Conformité Factur-X"
        ],
        cta: "Commencer gratuitement",
        href: "/register",
        popular: false
    },
    {
        name: "Pro",
        price: "19",
        description: "Pour les freelances actifs",
        features: [
            "Factures illimitées",
            "Clients illimités",
            "Devis et avoirs",
            "Tableau de bord avancé",
            "Rappels automatiques",
            "Export comptable",
            "Support prioritaire 24/7",
            "API access"
        ],
        cta: "Essayer 14 jours gratuits",
        href: "/register?plan=pro",
        popular: true
    },
    {
        name: "Entreprise",
        price: "49",
        description: "Pour les équipes et PME",
        features: [
            "Tout du plan Pro",
            "Multi-utilisateurs",
            "Gestion des rôles",
            "Intégrations avancées",
            "Comptable dédié",
            "Formation personnalisée",
            "SLA garanti",
            "Facturation sur mesure"
        ],
        cta: "Contactez-nous",
        href: "/contact",
        popular: false
    }
]

export function Pricing() {
    return (
        <section id="pricing" className="relative py-24 bg-black overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Tarifs simples et transparents
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Choisissez le plan qui correspond à vos besoins. Sans engagement, résiliable à tout moment.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative group"
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg">
                                        <Sparkles className="w-4 h-4" />
                                        Plus populaire
                                    </div>
                                </div>
                            )}

                            <div className={`relative h-full p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 ${plan.popular
                                    ? 'bg-gradient-to-b from-purple-900/30 to-zinc-900/50 border-2 border-purple-500/50 shadow-[0_0_50px_-10px_rgba(168,85,247,0.5)]'
                                    : 'bg-zinc-900/50 border border-white/10 hover:border-purple-500/30'
                                }`}>
                                {/* Plan Name */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-zinc-400 text-sm">{plan.description}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-white">{plan.price}€</span>
                                        <span className="text-zinc-400">/mois</span>
                                    </div>
                                    {plan.price !== "0" && (
                                        <p className="text-sm text-zinc-500 mt-2">HT - Facturation mensuelle</p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-zinc-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Link href={plan.href} className="block mt-auto">
                                    <Button
                                        className={`w-full h-12 text-base rounded-xl transition-all ${plan.popular
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50'
                                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                            }`}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-zinc-400 text-sm">
                        Tous les plans incluent la conformité Factur-X 2026 • Sans engagement • Résiliation en 1 clic
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
