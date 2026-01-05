"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Check, ShieldCheck, Zap } from "lucide-react"

export function Hero() {
    return (
        <section className="relative min-h-[110vh] flex flex-col justify-center overflow-hidden bg-black text-white pt-20">

            {/* Aurora Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto px-4 z-10 relative mt-20">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-zinc-300">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Conforme Loi Finances 2026
                    </div>
                </motion.div>

                {/* Main Heading- */}
                <div className="text-center max-w-5xl mx-auto space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
                    >
                        La facturation <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            réinventée pour le futur.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Invoicer FR n'est pas juste un outil de facturation. C'est votre assistant financier intelligent, conçu pour les freelances et PME qui exigent l'excellence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    >
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                Commencer gratuitement
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-all hover:scale-105">
                                Démonstration en direct
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Trust/Feature Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 flex flex-wrap justify-center gap-8 text-sm text-zinc-500"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        <span>Sécurité Bancaire</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-indigo-500" />
                        <span>Certifié Factur-X</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        <span>Support 24/7</span>
                    </div>
                </motion.div>

                {/* Floating UI Mockup (Abstract) */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    className="mt-20 mx-auto max-w-6xl relative perspective-[2000px] group"
                >
                    <div className="relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] transform group-hover:rotate-x-2 transition-transform duration-700 ease-out">
                        {/* Fake UI Content */}
                        <div className="absolute top-0 w-full h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="mx-auto w-64 h-6 rounded-md bg-white/5" />
                        </div>

                        <div className="p-8 mt-12 grid grid-cols-12 gap-8">
                            <div className="col-span-3 space-y-4">
                                <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                                <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
                                <div className="h-32 w-full bg-white/5 rounded-xl border border-white/5 mt-8" />
                            </div>
                            <div className="col-span-9 space-y-6">
                                <div className="flex justify-between">
                                    <div className="h-10 w-48 bg-white/10 rounded-lg" />
                                    <div className="h-10 w-32 bg-indigo-500/20 rounded-lg border border-indigo-500/30" />
                                </div>
                                <div className="h-64 w-full bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5" />
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/5" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
