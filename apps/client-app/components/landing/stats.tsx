"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, FileText, Clock } from "lucide-react"

const stats = [
    {
        icon: Users,
        value: "2,500+",
        label: "Entrepreneurs actifs",
        description: "Nous font confiance"
    },
    {
        icon: FileText,
        value: "50,000+",
        label: "Factures créées",
        description: "Chaque mois"
    },
    {
        icon: TrendingUp,
        value: "98%",
        label: "Satisfaction client",
        description: "Note moyenne"
    },
    {
        icon: Clock,
        value: "< 2min",
        label: "Temps moyen",
        description: "Pour créer une facture"
    }
]

export function Stats() {
    return (
        <section className="relative py-20 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-lg font-semibold text-zinc-300 mb-1">
                                {stat.label}
                            </div>
                            <div className="text-sm text-zinc-500">
                                {stat.description}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
