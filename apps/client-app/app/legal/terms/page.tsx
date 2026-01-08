"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-4xl font-heading font-bold mb-8">Conditions Générales d'Utilisation (CGU)</h1>
                <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
                    <p className="text-sm text-zinc-500">Dernière mise à jour : 01 Janvier 2026</p>

                    <h2 className="text-2xl font-bold text-white">1. Objet</h2>
                    <p>Les présentes CGU ont pour objet de définir les modalités de mise à disposition des services de la plateforme de facturation SaaS.</p>

                    <h2 className="text-2xl font-bold text-white">2. Services</h2>
                    <p>La plateforme permet l'édition de devis, factures, et la gestion de la comptabilité simplifiée pour les professionnels.</p>

                    <h2 className="text-2xl font-bold text-white">3. Responsabilité</h2>
                    <p>L'utilisateur est seul responsable de l'exactitude des informations fiscales et légales renseignées sur ses documents.</p>

                    <h2 className="text-2xl font-bold text-white">4. Données Personnelles</h2>
                    <p>Conformément au RGPD, vous disposez d'un droit d'accès et de rectification de vos données.</p>

                    {/* Placeholder for legal content */}
                    <p className="italic opacity-50">[...] (Ceci est un document type à compléter par un service juridique)</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
