import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck, Zap, Users } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
              ExpertPortail
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Fonctionnalités</Link>
            <Link href="#benefits" className="hover:text-blue-600 transition-colors">Avantages</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Offres</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                Devenir Partenaire
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Nouveau : Récupération bancaire automatique
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
              Le futur de l'expertise comptable est <span className="text-blue-600">collaboratif</span>.
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Simplifiez la gestion de vos dossiers clients. Automatisez la collecte des factures, suivez la trésorerie en temps réel et offrez une expérience premium à vos clients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200">
                Demander une démo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700">
                Découvrir les offres
              </Button>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/50 p-4 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                <img
                  src="/dashboard-preview.png"
                  alt="Interface du logiciel"
                  className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-700"
                  style={{ minHeight: '400px', objectFit: 'cover', background: '#f8fafc' }}
                />
                {/* Fallback visual if image missing */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
                  <span className="text-9xl opacity-10">Interface Demo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tout ce dont vous avez besoin pour exceller</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Une suite d'outils complète conçue par et pour des experts-comptables exigeants.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
                  title: "Automatisation Comptable",
                  desc: "Fini la saisie manuelle. Importez automatiquement les factures d'achat et de vente, et laissez notre IA faire le pré-lettrage."
                },
                {
                  icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
                  title: "Tableaux de Bord",
                  desc: "Donnez à vos clients une vision claire de leur activité avec des graphiques interactifs et des indicateurs de performance en temps réel."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
                  title: "Conformité Factur-X",
                  desc: "Préparez l'avenir sereinement. Notre plateforme est nativement compatible avec la réforme de la facturation électronique 2026."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-light opacity-80 mb-12">Ils nous font confiance</h2>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Cabinet A', 'Fiduciaire B', 'Audit C', 'Consulting D'].map((name, i) => (
                <div key={i} className="text-2xl font-bold">{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Offers */}
        <section id="pricing" className="py-24 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Des offres adaptées à votre cabinet</h2>
              <p className="text-slate-500">Que vous soyez indépendant ou un grand cabinet, nous avons une solution pour vous.</p>
            </div>

            <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Partenaire Standard</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">Gratuit</span>
                    <span className="ml-1 text-xl font-semibold text-slate-500">/mois</span>
                  </div>
                  <p className="mt-4 text-slate-500">Pour les experts indépendants qui débutent.</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Accès illimité aux dossiers clients', 'Export FEC standard', 'Support par email', '1 Utilisateur cabinet'].map((item) => (
                    <li key={item} className="flex items-center text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl h-12 text-lg" variant="outline">Commencer gratuitement</Button>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 relative">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  POPULAIRE
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">Cabinet Premium</h3>
                  <div className="mt-4 flex items-baseline text-white">
                    <span className="text-4xl font-extrabold tracking-tight">199€</span>
                    <span className="ml-1 text-xl font-semibold text-slate-400">/mois</span>
                  </div>
                  <p className="mt-4 text-slate-400">Pour les cabinets en croissance.</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Tout du plan Standard', 'Marque blanche (Logo cabinet)', 'API & Intégrations', 'Utilisateurs illimités', 'Support prioritaire 24/7'].map((item) => (
                    <li key={item} className="flex items-center text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl h-12 text-lg text-white">Devenir Partenaire Premium</Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Prêt à transformer votre cabinet ?</h2>
            <p className="text-lg text-slate-600 mb-10">Rejoignez le réseau d'experts-comptables qui construisent l'avenir de la profession.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                Créer un compte cabinet
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-slate-600 hover:bg-slate-50">
                Contacter l'équipe commerciale
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 Facture App - Portail Expert. Tous droits réservés.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="#" className="hover:text-slate-900">Mentions Légales</Link>
            <Link href="#" className="hover:text-slate-900">Confidentialité</Link>
            <Link href="#" className="hover:text-slate-900">CGV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
