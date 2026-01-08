"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, Zap } from "lucide-react"

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-dark text-white pt-32 pb-20">

            {/* Aurora Background Effects - Deep Blue & Gold */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-brand-gold/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto px-4 z-10 relative">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-zinc-300 shadow-xl">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                        </span>
                        <span className="font-medium text-brand-gold">Nouveau</span>
                        <span className="text-zinc-500">|</span>
                        Conformité Factur-X 2026
                    </div>
                </motion.div>

                {/* Main Heading */}
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
                    >
                        L'Excellence <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">
                            Financière.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Une suite de facturation conçue pour ceux qui exigent la perfection.
                        Gagnez du temps, sécurisez vos revenus et impressionnez vos clients.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-8 text-lg font-medium rounded-full bg-brand-gold text-brand-dark hover:bg-yellow-400 transition-all hover:scale-105 shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)]">
                                Commencer maintenant
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105">
                                Voir la démo
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* 3D Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: 15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    whileHover={{ rotateX: 5, scale: 1.02 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
                    className="mt-20 mx-auto max-w-6xl relative perspective-[2000px] group"
                >
                    {/* Floating Card 1: Revenue */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-12 top-20 z-20 hidden lg:block"
                    >
                        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-48">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="text-sm text-zinc-400">Revenus</div>
                            </div>
                            <div className="text-2xl font-bold font-heading">+12,450 €</div>
                            <div className="text-xs text-green-500 font-medium">+15% vs mois dernier</div>
                        </div>
                    </motion.div>

                    {/* Floating Card 2: Invoice Sent */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -right-8 top-40 z-20 hidden lg:block"
                    >
                        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-56">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-brand-blue/20 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Facture Envoyée</div>
                                    <div className="text-xs text-zinc-400">Client: Studio Design</div>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-blue w-3/4" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Dashboard Interface */}
                    <div className="relative rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[16/10] ring-1 ring-white/10">
                        {/* Header */}
                        <div className="h-14 border-b border-white/5 flex items-center px-6 gap-4 bg-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1" />
                            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-xs text-brand-gold font-bold">AA</div>
                        </div>

                        {/* Body */}
                        <div className="flex h-full">
                            {/* Sidebar */}
                            <div className="w-64 border-r border-white/5 p-6 space-y-6 hidden md:block">
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map(i => <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-brand-blue/20 text-brand-blue' : 'hover:bg-white/5'} flex items-center px-3`}><div className={`w-4 h-4 ${i === 1 ? 'bg-brand-blue' : 'bg-zinc-700'} rounded-sm mr-3`} /></div>)}
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex-1 p-8 space-y-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="h-6 w-32 bg-zinc-800 rounded mb-2" />
                                        <div className="h-10 w-64 bg-zinc-700 rounded-lg" />
                                    </div>
                                    <div className="h-10 w-32 bg-brand-gold rounded-full" />
                                </div>
                                {/* Chart Area */}
                                <div className="h-64 rounded-xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                                    {/* Fake Graph Lines */}
                                    <svg className="absolute inset-0 w-full h-full text-brand-blue/30" preserveAspectRatio="none">
                                        <path d="M0,100 C100,50 200,80 300,40 S500,60 600,20 L600,200 L0,200 Z" fill="currentColor" />
                                        <path d="M0,100 C100,50 200,80 300,40 S500,60 600,20" stroke="rgb(99, 102, 241)" strokeWidth="3" fill="none" />
                                    </svg>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="h-32 rounded-xl bg-zinc-900 border border-white/5" />
                                    <div className="h-32 rounded-xl bg-zinc-900 border border-white/5" />
                                    <div className="h-32 rounded-xl bg-zinc-900 border border-white/5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Shadows */}
                <div className="absolute top-[50%] left-[50%] w-[80%] h-[20%] -translate-x-1/2 bg-brand-blue/20 blur-[100px] -z-10" />

            </div>
        </section>
    )
}
