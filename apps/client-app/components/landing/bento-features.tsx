"use client"

import { motion } from "framer-motion"
import { Zap, Globe, ShieldCheck, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "Éditeur Intelligent",
        description: "L'éditeur le plus rapide du marché. Autocomplétion, calculs automatiques et design en temps réel.",
        icon: Zap,
        className: "md:col-span-2",
        img: "editor"
    },
    {
        title: "Conformité Factur-X",
        description: "Ne vous souciez plus des lois. Tout est aux normes 2026 par défaut.",
        icon: ShieldCheck,
        className: "md:col-span-1",
        img: "compliance"
    },
    {
        title: "Analyses Financières",
        description: "Suivez votre Chiffre d'Affaires, TVA et impayés en un coup d'œil.",
        icon: PieChart,
        className: "md:col-span-1",
        img: "analytics"
    },
    {
        title: "Paiement Universel",
        description: "Vos clients paient par Carte, Virement ou Apple Pay directement depuis la facture.",
        icon: Globe,
        className: "md:col-span-2",
        img: "payment"
    },
]

export function BentoFeatures() {
    return (
        <section id="features" className="py-32 bg-brand-dark text-white relative">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                        Tout est inclus. <span className="text-zinc-500">Vraiment tout.</span>
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Remplacez 5 outils par une seule plateforme unifiée.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10",
                                feature.className
                            )}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 inline-flex p-3 rounded-xl bg-brand-blue/10 text-brand-blue w-fit">
                                    <feature.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-zinc-400 mb-8">{feature.description}</p>

                                {/* Image Placeholder */}
                                <div className="mt-auto overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl relative aspect-video group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/80">
                                        <span className="text-zinc-500 text-xs tracking-widest uppercase border border-zinc-600 px-3 py-1 rounded">
                                            Place for Img: {feature.img}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
