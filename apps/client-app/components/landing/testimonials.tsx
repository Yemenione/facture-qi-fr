"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Sophie Martin",
        role: "Consultante Freelance",
        company: "SM Consulting",
        image: "/images/testimonial-1.png",
        content: "Invoicer FR a transformé ma gestion administrative. Je crée mes factures en moins de 2 minutes maintenant. La conformité Factur-X est un vrai plus pour mes clients grands comptes.",
        rating: 5
    },
    {
        name: "Thomas Dubois",
        role: "Fondateur",
        company: "TechStart SARL",
        image: "/images/testimonial-2.png",
        content: "Enfin un outil de facturation pensé pour les entrepreneurs français ! Le tableau de bord me donne une vision claire de ma trésorerie. Support réactif et interface intuitive.",
        rating: 5
    },
    {
        name: "Léa Bernard",
        role: "Directrice",
        company: "Creative Studio",
        image: "/images/testimonial-3.png",
        content: "J'ai testé plusieurs solutions, Invoicer FR est de loin la meilleure. Design moderne, fonctionnalités complètes, et surtout 100% conforme à la réglementation française 2026.",
        rating: 5
    }
]

export function Testimonials() {
    return (
        <section id="testimonials" className="relative py-24 bg-brand-dark overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                        Ils nous font confiance
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Rejoignez des milliers d'entrepreneurs qui ont simplifié leur facturation
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative h-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-brand-gold/20 bg-zinc-800">
                                        {/* Placeholder for user image if needed, or gradient */}
                                        <div className="w-full h-full bg-gradient-to-br from-brand-blue to-purple-600 opacity-50" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-sm text-zinc-400">{testimonial.role}</div>
                                        <div className="text-xs text-zinc-500">{testimonial.company}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-yellow-600 ring-2 ring-brand-dark" />
                            ))}
                        </div>
                        <span className="text-zinc-300 text-sm">
                            <span className="font-semibold text-white">+2,500</span> entrepreneurs satisfaits
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
