"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCog, Lock, CreditCard, ArrowRight } from "lucide-react";

export default function AccountGuidePage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <article className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-12">
                    <Link href="/docs" className="text-zinc-500 hover:text-brand-gold mb-4 inline-block text-sm">← Retour au Centre d'Aide</Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Gérer mon Compte</h1>
                    <p className="text-xl text-zinc-400">Paramètres personnels, sécurité et abonnement.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-gold/30 transition-colors">
                        <UserCog className="w-10 h-10 text-brand-gold mb-6" />
                        <h3 className="text-2xl font-bold mb-3">Profil & Équipe</h3>
                        <p className="text-zinc-400 mb-4">Modifiez vos informations personnelles et invitez des collaborateurs. Gérez les rôles (Admin, Comptable, Vente) pour contrôler les accès.</p>
                        <Link href="#" className="text-brand-blue hover:text-blue-300 text-sm font-bold flex items-center">En savoir plus <ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-gold/30 transition-colors">
                        <CreditCard className="w-10 h-10 text-green-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-3">Abonnement</h3>
                        <p className="text-zinc-400 mb-4">Consultez vos factures d'abonnement, changez de plan ou mettez à jour votre moyen de paiement.</p>
                        <Link href="#" className="text-brand-blue hover:text-blue-300 text-sm font-bold flex items-center">Gérer mon abonnement <ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-brand-gold/30 transition-colors md:col-span-2">
                        <Lock className="w-10 h-10 text-red-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-3">Sécurité</h3>
                        <p className="text-zinc-400 mb-4">Activez l'authentification à deux facteurs (2FA) pour sécuriser l'accès à vos données financières sensibles. Consultez le journal des connexions.</p>
                    </div>
                </div>

            </article>
            <Footer />
        </main>
    )
}
