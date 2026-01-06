"use client"

import { useState, useEffect } from "react"
import { Check, Shield, Star, Zap, Loader2 } from "lucide-react"
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
                            ["5 Invoices/mo", "Basic Templates", "Email Support", "Factur-X Compliance"] :
                            plan.code === 'PRO' ?
                                ["Unlimited Invoices", "Custom Branding", "Priority Support", "API Access", "Quotes & Credit Notes"] :
                                ["All Pro Features", "Dedicated Manager", "SLA", "Audit Logs", "SSO Support"],
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
        <div className="p-8 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                    Choose the Right Plan for Your Business
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Whether you are just starting out or running a large enterprise, we have a plan that fits your needs.
                    Upgrade anytime as you grow.
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
                            className={`relative rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition-shadow ${plan.recommended ? 'border-2 border-indigo-600 ring-4 ring-indigo-50/50' : 'border-gray-200'
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> Recommended
                                    </span>
                                </div>
                            )}

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-gray-900">{plan.priceMonthly}€</span>
                                <span className="text-gray-500 ml-1">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-center text-sm text-gray-700">
                                        <Check className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${plan.recommended ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                                variant={plan.recommended ? "default" : "secondary"}
                                disabled={isCurrent}
                            >
                                {isCurrent ? 'Current Plan' : 'Upgrade Now'}
                            </Button>
                        </motion.div>
                    )
                })}
            </div>

            <div className="mt-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
                <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure & Reliable</h2>
                <p className="text-gray-600 max-w-xl mx-auto mb-6">
                    All payments are processed securely via Stripe. You can cancel your subscription at any time with no hidden fees.
                </p>
                <div className="flex justify-center gap-4 text-sm font-medium text-gray-500">
                    <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> SSL Encrypted</span>
                    <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 24/7 Support</span>
                </div>
            </div>
        </div>
    )
}
