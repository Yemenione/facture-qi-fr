"use client"

import { useState, useEffect } from "react"
import { Check, Shield, Star, Zap, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import companyService from "@/services/company.service"

export default function SubscriptionPage() {
    const [plans, setPlans] = useState<any[]>([])
    const [currentPlanCode, setCurrentPlanCode] = useState<string>("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [plansRes, companyRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`),
                    companyService.get()
                ])

                if (plansRes.ok) {
                    const plansData = await plansRes.json()
                    // Map DB plans to UI structure
                    const mappedPlans = plansData.map((plan: any) => ({
                        ...plan,
                        features: plan.code === 'FREE' ?
                            ["5 Factures/mois", "Modèles Simples", "Support Email", "Conforme Factur-X"] :
                            plan.code === 'PRO' ?
                                ["Factures Illimitées", "Personnalisation Avancée", "Support Prioritaire", "Accès API", "Devis & Avoirs"] :
                                ["Tout illimité", "Gestionnaire Dédié", "SLA Garanti", "Logs d'audit", "Support SSO"],
                        recommended: plan.code === 'PRO'
                    }))
                    setPlans(mappedPlans)
                }

                if (companyRes && (companyRes as any).plan) {
                    setCurrentPlanCode((companyRes as any).plan.code)
                }

            } catch (error) {
                console.error("Failed to load subscription data", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
    }

    return (
        <div className="p-8 max-w-6xl mx-auto pb-20">
            <div className="text-center mb-12">
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 inline-block">Offres & Tarifs</span>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Des tarifs clairs, sans surprises
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Que vous soyez indépendant ou une grande entreprise, nous avons la formule adaptée à votre croissance. Changez d'offre à tout moment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const isCurrent = plan.code === currentPlanCode;
                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white ${plan.recommended ? 'border-2 border-indigo-600 shadow-indigo-100' : 'border-slate-200'
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                                        <Sparkles className="w-3 h-3 fill-current" /> Populaire
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">Idéal pour démarrer</p>
                            </div>

                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-extrabold text-slate-900">{plan.priceMonthly}€</span>
                                <span className="text-slate-500 ml-2 font-medium">/mois</span>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start text-sm text-slate-700">
                                            <div className="p-0.5 bg-green-100 rounded-full mr-3 text-green-600 mt-0.5">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                className={`w-full py-6 text-base font-semibold transition-all ${plan.recommended
                                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300'
                                        : 'bg-slate-900 hover:bg-slate-800'
                                    }`}
                                variant={plan.recommended ? "default" : "secondary"}
                                disabled={isCurrent}
                            >
                                {isCurrent ? 'Votre offre actuelle' : 'Choisir cette offre'}
                            </Button>
                        </motion.div>
                    )
                })}
            </div>

            <div className="mt-20 bg-white border border-slate-100 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Shield className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Paiement Sécurisé & Serein</h2>
                    <p className="text-slate-500 max-w-xl mx-auto mb-8">
                        Tous nos paiements sont sécurisés par Stripe, leader mondial du paiement en ligne.
                        Vous pouvez annuler votre abonnement à tout moment, sans frais cachés ni engagement long terme.
                    </p>
                    <div className="flex justify-center flex-wrap gap-8 text-sm font-medium text-slate-600">
                        <span className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Chiffrement SSL 256-bit</span>
                        <span className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Support Français 7j/7</span>
                        <span className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Satisfait ou remboursé (14j)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
