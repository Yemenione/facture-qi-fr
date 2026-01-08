"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Terminal, Code2, Webhook, BookOpen } from "lucide-react";

export default function ApiDocsPage() {
    return (
        <main className="min-h-screen bg-brand-dark selection:bg-brand-gold/30 text-white">
            <Navbar />

            <div className="relative pt-32 pb-20 overflow-hidden bg-white/5 border-b border-white/10">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <Badge className="bg-brand-blue text-white mb-4">Pour les Développeurs</Badge>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 font-mono">
                        API & Intégrations
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Connectez votre ERP, votre CRM ou votre site e-commerce à notre plateforme de facturation.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
                            <BookOpen className="w-4 h-4 mr-2" /> Documentation API
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                            Obtenir une clé API
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-xl border border-white/10 bg-black/20">
                        <Terminal className="w-10 h-10 text-brand-gold mb-4" />
                        <h3 className="text-xl font-bold mb-2 font-mono">REST API</h3>
                        <p className="text-zinc-400 text-sm">Une API RESTful complète pour gérer clients, factures et produits. Standards OpenAPI (Swagger).</p>
                    </div>
                    <div className="p-6 rounded-xl border border-white/10 bg-black/20">
                        <Webhook className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2 font-mono">Webhooks</h3>
                        <p className="text-zinc-400 text-sm">Recevez des notifications en temps réel lors du paiement d'une facture ou de la création d'un client.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-white/10 bg-black/20">
                        <Code2 className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2 font-mono">Client SDKs</h3>
                        <p className="text-zinc-400 text-sm">Bibliothèques officielles pour Node.js, Python et PHP pour accélérer votre intégration.</p>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-xl border border-white/10 bg-black/40 font-mono text-sm overflow-x-auto">
                    <div className="text-zinc-500 mb-2">// Example: Create a draft invoice</div>
                    <div className="text-purple-400">POST <span className="text-white">https://api.saas-facture.fr/v1/invoices</span></div>
                    <div className="text-blue-400 mt-2">Authorization: <span className="text-orange-300">Bearer sk_live_...</span></div>
                    <pre className="text-zinc-300 mt-4">
                        {`{
  "customer_id": "cust_123456",
  "items": [
    {
      "description": "Développement Web",
      "quantity": 1,
      "unit_price": 500.00
    }
  ]
}`}
                    </pre>
                </div>
            </div>

            <Footer />
        </main>
    )
}
