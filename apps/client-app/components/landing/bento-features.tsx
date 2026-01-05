"use client"

import { motion } from "framer-motion"
import { FileText, Smartphone, LayoutGrid, Zap, Lock, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "Éditeur Ultra-Rapide",
        description: "Créez des factures en moins de 30 secondes avec notre éditeur intelligent qui apprend de vos habitudes.",
        icon: Zap,
        className: "md:col-span-2",
        color: "from-amber-500/20 to-orange-500/20 text-orange-400"
    },
    {
        title: "Factur-X Natif",
        description: "Conformité totale avec la loi 2026. Vos factures sont prêtes pour Chorus Pro.",
        icon: Lock,
        className: "md:col-span-1",
        color: "from-green-500/20 to-emerald-500/20 text-emerald-400"
    },
    {
        title: "Dashboard Intuitif",
        description: "Une vue d'ensemble claire de votre trésorerie, en temps réel.",
        icon: LayoutGrid,
        className: "md:col-span-1",
        color: "from-blue-500/20 to-cyan-500/20 text-blue-400"
    },
    {
        title: "Paiement en ligne",
        description: "Faites-vous payer 2x plus vite via Carte Bancaire ou Virement instantané.",
        icon: Globe,
        className: "md:col-span-2",
        color: "from-purple-500/20 to-pink-500/20 text-purple-400"
    },
]

export function BentoFeatures() {
    return (
        <section id="features" className="py-32 bg-black text-white relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        Tout ce dont vous avez besoin. <br />
                        Rien de superflu.
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Une suite d'outils puissants condensée dans une interface minimaliste.
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
                                "group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 hover:bg-zinc-800/50 transition-all duration-300",
                                feature.className
                            )}
                        >
                            <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                                feature.color
                            )} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={cn("p-3 w-fit rounded-xl bg-white/5 mb-6", feature.color.split(' ')[2])}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative Image/Mockup area (optional) */}
                                <div className="mt-8 flex-1 rounded-xl bg-black/20 border border-white/5 translate-y-8 group-hover:translate-y-4 transition-transform duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
