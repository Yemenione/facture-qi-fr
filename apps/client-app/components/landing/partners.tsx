"use client"

import { motion } from "framer-motion"

const partners = [
    { name: "Société Générale", logo: "SG" },
    { name: "BNP Paribas", logo: "BNP" },
    { name: "Qonto", logo: "Qonto" },
    { name: "Stripe", logo: "Stripe" },
    { name: "SumUp", logo: "SumUp" },
    { name: "Crédit Agricole", logo: "CA" },
    { name: "LCL", logo: "LCL" },
]

export function Partners() {
    return (
        <section className="bg-brand-dark border-t border-white/5 py-10 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                    Intégré avec les meilleures banques et outils
                </p>
            </div>

            <div className="relative flex w-full overflow-hidden mask-linear-fade">
                {/* Mask for fading edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-brand-dark to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-dark to-transparent z-10" />

                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="flex min-w-full gap-20 items-center justify-around whitespace-nowrap px-10"
                >
                    {[...partners, ...partners].map((partner, i) => (
                        <div key={i} className="text-2xl font-bold text-zinc-600 hover:text-white transition-colors duration-300 cursor-pointer">
                            {/* Placeholder Text Logos for now, can be replaced with SVGs */}
                            {partner.name}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
