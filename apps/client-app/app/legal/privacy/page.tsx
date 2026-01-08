"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-4xl font-heading font-bold mb-8">Politique de Confidentialité</h1>
                <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
                    <p className="text-sm text-zinc-500">Dernière mise à jour : 01 Janvier 2026</p>

                    <h2 className="text-2xl font-bold text-white">1. Collecte des données</h2>
                    <p>Nous collectons les données nécessaires à l'établissement de vos factures et à la gestion de votre compte (Nom, SIRET, Email, Coordonnées bancaires).</p>

                    <h2 className="text-2xl font-bold text-white">2. Utilisation</h2>
                    <p>Vos données ne sont jamais revendues. Elles sont utilisées exclusivement pour le service de facturation et les obligations légales.</p>

                    <h2 className="text-2xl font-bold text-white">3. Sécurité</h2>
                    <p>Toutes les données sont chiffrées (AES-256) et hébergées sur des serveurs sécurisés en France.</p>

                    <h2 className="text-2xl font-bold text-white">4. Cookies</h2>
                    <p>Nous utilisons uniquement des cookies techniques essentiels au fonctionnement de l'application.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
