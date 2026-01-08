"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message envoyé avec succès ! Nous vous répondrons sous 24h.");
        setLoading(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            {/* HEADER */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                        Contactez <span className="text-brand-gold">Nous</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Une question sur la mise en conformité Factur-X ? Besoin d'une démo personnalisée ? Nos experts sont à votre écoute en France.
                    </p>
                </div>
            </section>

            {/* CONTENT GRID */}
            <section className="py-12 pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* LEFT: INFO */}
                        <div className="space-y-8">
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-gold/30 transition-colors">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Building2 className="text-brand-gold h-6 w-6" />
                                    Nos Coordonnées
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Siège Social</p>
                                            <p className="text-zinc-400">12 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Email</p>
                                            <a href="mailto:contact@saas-facture.fr" className="text-zinc-400 hover:text-brand-gold transition-colors">contact@saas-facture.fr</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-brand-blue/10 rounded-lg text-brand-blue">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">Téléphone</p>
                                            <p className="text-zinc-400">+33 1 23 45 67 89</p>
                                            <p className="text-xs text-zinc-500 mt-1">Lun-Ven, 9h-18h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MAP PLACEHOLDER */}
                            <div className="h-64 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors" />
                                <MapPin className="h-12 w-12 text-brand-gold opacity-50" />
                                <span className="absolute bottom-4 text-sm text-zinc-500">Paris, France</span>
                            </div>
                        </div>

                        {/* RIGHT: FORM */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                            <h3 className="text-2xl font-bold mb-2">Envoyez-nous un message</h3>
                            <p className="text-zinc-400 mb-8 text-sm">Remplissez le formulaire ci-dessous, nous vous répondrons très rapidement.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-zinc-300">Prénom</Label>
                                        <Input id="firstName" required placeholder="Jean" className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-brand-gold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-zinc-300">Nom</Label>
                                        <Input id="lastName" required placeholder="Dupont" className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-brand-gold" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-zinc-300">Email professionnel</Label>
                                    <Input id="email" type="email" required placeholder="jean.dupont@entreprise.fr" className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-brand-gold" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-zinc-300">Sujet</Label>
                                    <Input id="subject" required placeholder="Demande de démo / Question technique..." className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-brand-gold" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-zinc-300">Message</Label>
                                    <Textarea id="message" required placeholder="Bonjour, je souhaiterais..." rows={5} className="bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus:border-brand-gold resize-none" />
                                </div>

                                <Button type="submit" disabled={loading} size="lg" className="w-full bg-brand-gold text-brand-dark hover:bg-yellow-500 font-bold text-lg h-12">
                                    {loading ? "Envoi en cours..." : (
                                        <>
                                            Envoyer le message <Send className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
