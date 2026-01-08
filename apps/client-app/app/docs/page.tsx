"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, HelpCircle, Search, Shield, Zap, ChevronRight, Video, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            {/* HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="outline" className="mb-4 border-brand-gold/30 text-brand-gold bg-brand-gold/5">
                        Centre d'Aide & Documentation
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                        Comment pouvons-nous <br /><span className="text-brand-gold">vous aider ?</span>
                    </h1>

                    <div className="max-w-2xl mx-auto relative mt-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-5 w-5" />
                        <Input
                            placeholder="Rechercher un guide, un article, une API..."
                            className="h-14 pl-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-brand-gold focus:ring-0 text-lg shadow-xl shadow-black/20"
                        />
                    </div>
                </div>
            </section>

            {/* QUICK LINKS */}
            <section className="py-12 border-b border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Zap, title: "Premiers Pas", desc: "Configuration du compte et import des données.", color: "text-amber-400", href: "/docs/getting-started" },
                            { icon: FileText, title: "Gestion des Factures", desc: "Créer, envoyer et suivre vos paiements.", color: "text-blue-400", href: "/docs/tutorials/invoicing" },
                            { icon: Shield, title: "Conformité & Légal", desc: "Tout savoir sur Factur-X et la TVA.", color: "text-green-400", href: "/docs/compliance/factur-x" },
                        ].map((item, i) => (
                            <Link href={item.href} key={i} className="group">
                                <Card className="bg-white/5 border-white/10 hover:border-brand-gold/30 transition-all hover:bg-white/[0.07] h-full">
                                    <CardHeader>
                                        <item.icon className={`h-8 w-8 ${item.color} mb-2`} />
                                        <CardTitle className="text-white group-hover:text-brand-gold transition-colors">{item.title}</CardTitle>
                                        <CardDescription className="text-zinc-400">{item.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOCUMENTATION SECTIONS */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-12">

                        {/* SIDEBAR NAVIGATION */}
                        <div className="lg:col-span-1 space-y-8 sticky top-24 h-fit">
                            <div>
                                <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Guides</h4>
                                <ul className="space-y-2">
                                    {[
                                        { label: 'Démarrage Rapide', href: '/docs/getting-started' },
                                        { label: 'Facturation', href: '/docs/tutorials/invoicing' },
                                        { label: 'Conformité Factur-X', href: '/docs/compliance/factur-x' },
                                        { label: 'Conditions Générales', href: '/legal/terms' },
                                        { label: 'Confidentialité', href: '/legal/privacy' }
                                    ].map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="text-zinc-400 hover:text-brand-gold transition-colors flex items-center justify-between group">
                                                {link.label}
                                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Développeurs</h4>
                                <ul className="space-y-2">
                                    {['API Reference', 'Webhooks', 'Authentification', 'SDKs'].map((link) => (
                                        <li key={link}>
                                            <Link href="#" className="text-zinc-400 hover:text-brand-gold transition-colors flex items-center justify-between group">
                                                {link}
                                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-3 space-y-12">

                            {/* POPULAR ARTICLES */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Book className="text-brand-gold h-6 w-6" /> Articles Populaires
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { label: "Comment personnaliser mon modèle de facture ?", href: "/docs/tutorials/invoicing" },
                                        { label: "Connecter mon compte bancaire", href: "/docs/getting-started" },
                                        { label: "Tout comprendre sur Factur-X", href: "/docs/compliance/factur-x" },
                                        { label: "Exporter mes données au format FEC", href: "/docs/getting-started" }
                                    ].map((article, i) => (
                                        <Link href={article.href} key={i} className="block group">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-gold/30 transition-all flex items-center justify-between">
                                                <span className="text-zinc-300 group-hover:text-white">{article.label}</span>
                                                <ChevronRight className="text-zinc-600 group-hover:text-brand-gold" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* VIDEO TUTORIALS */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Video className="text-brand-gold h-6 w-6" /> Tutoriels Vidéo
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { title: "Découverte de l'interface", duration: "2:30" },
                                        { title: "Créer sa première facture", duration: "1:45" }
                                    ].map((video, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="aspect-video bg-black/40 rounded-xl border border-white/10 flex items-center justify-center mb-3 group-hover:border-brand-gold/30 transition-colors relative overflow-hidden">
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-all">
                                                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-white group-hover:text-brand-gold transition-colors">{video.title}</h3>
                                            <p className="text-sm text-zinc-500">{video.duration}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* HELP CTA */}
            <section className="py-20 bg-brand-blue/5 border-t border-brand-blue/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="secondary" className="bg-brand-blue/20 text-brand-blue-light mb-4 text-brand-blue">Support 24/7</Badge>
                    <h2 className="text-3xl font-heading font-bold mb-4">Besoin d'aide supplémentaire ?</h2>
                    <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Notre équipe de support est disponible pour répondre à toutes vos questions, techniques ou comptables.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-yellow-500 font-bold rounded-full">
                                <MessageCircle className="mr-2 h-4 w-4" /> Contacter le Support
                            </Button>
                        </Link>
                        <Link href="/solutions/pme">
                            <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full">
                                Demander une Démo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
