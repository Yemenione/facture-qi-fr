"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, CreditCard, Palette, CheckCircle2, Search, ArrowRight, Loader2, UploadCloud } from "lucide-react"
import companyService from "@/services/company.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/providers/toast-provider"
import { Progress } from "@/components/ui/progress"

export default function OnboardingPage() {
    const router = useRouter()
    const toast = useToast()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(true)

    // Form States
    const [company, setCompany] = useState<any>({
        name: "",
        siret: "",
        vatNumber: "",
        address: { street: "", zip: "", city: "", country: "France" },
        iban: "",
        bic: "",
        logoUrl: ""
    })

    useEffect(() => {
        // Load existing data to pre-fill
        const load = async () => {
            try {
                const data = await companyService.get()
                // If company is already full, redirect to dashboard
                if (data.siret && data.address?.street && (data as any).iban) {
                    router.push("/dashboard")
                    return
                }

                setCompany((prev: any) => ({
                    ...prev,
                    ...data,
                    address: typeof data.address === 'string' ? { street: data.address } : (data.address || prev.address)
                }))
            } catch (e) {
                console.error(e)
            } finally {
                setInitializing(false)
            }
        }
        load()
    }, [router])

    const handleSiretSearch = async () => {
        if (!company.siret || company.siret.length < 9) {
            toast.warning("SIREN invalide", "Veuillez entrer au moins 9 chiffres.")
            return
        }
        setLoading(true)
        try {
            const data = await companyService.searchSiret(company.siret)
            if (data) {
                setCompany((prev: any) => ({
                    ...prev,
                    name: data.name || prev.name,
                    rcs: data.rcs || prev.rcs,
                    vatNumber: data.vatNumber || prev.vatNumber,
                    address: {
                        street: (data as any).street || prev.address?.street,
                        zip: (data as any).zipCode || prev.address?.zip,
                        city: (data as any).city || prev.address?.city,
                        country: "France"
                    }
                }))
                toast.success("Succès", "Informations de l'entreprise trouvées !")
            }
        } catch (error) {
            toast.error("Erreur", "Impossible de trouver cette entreprise.")
        } finally {
            setLoading(false)
        }
    }

    const handleNext = async () => {
        if (step === 3) {
            await finalizeOnboarding()
        } else {
            setStep(prev => prev + 1)
        }
    }

    const finalizeOnboarding = async () => {
        setLoading(true)
        try {
            await companyService.update(company)
            toast.success("Félicitations !", "Votre compte est prêt.")
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            toast.error("Erreur", "Une erreur est survenue lors de l'enregistrement.")
        } finally {
            setLoading(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const url = await companyService.uploadLogo(file)
            setCompany(prev => ({ ...prev, logoUrl: url }))
            toast.success("Logo uploadé", "Votre logo a été ajouté.")
        } catch (error) {
            toast.error("Erreur", "Échec de l'upload du logo.")
        }
    }

    if (initializing) {
        return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
    }

    const steps = [
        { id: 1, title: "Identité", icon: Building2 },
        { id: 2, title: "Banque", icon: CreditCard },
        { id: 3, title: "image de marque", icon: Palette },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenue sur Factuer FR 🇫🇷</h1>
                    <p className="text-slate-500">Configurons votre espace en quelques étapes simples.</p>
                </div>

                <div className="flex justify-between mb-8 px-8">
                    {steps.map((s, idx) => {
                        const active = step === s.id
                        const done = step > s.id
                        return (
                            <div key={s.id} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${active ? "bg-indigo-600 text-white shadow-lg scale-110" :
                                    done ? "bg-emerald-500 text-white" : "bg-white text-slate-400 border border-slate-200"
                                    }`}>
                                    {done ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${active ? "text-indigo-600" : "text-slate-500"}`}>
                                    {s.title}
                                </span>
                            </div>
                        )
                    })}
                    {/* Progress Bar Background is tricky with flex justify-between, simplified visual here */}
                </div>

                <Card className="border-0 shadow-xl bg-white overflow-hidden">
                    <CardContent className="p-8 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
                                            <Label className="text-indigo-900 font-semibold mb-2 block">Recherche automatique (SIREN/SIRET)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={company.siret}
                                                    onChange={e => setCompany({ ...company, siret: e.target.value })}
                                                    placeholder="ex: 123 456 789"
                                                    className="bg-white"
                                                />
                                                <Button onClick={handleSiretSearch} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nom de l'entreprise *</Label>
                                                <Input
                                                    value={company.name}
                                                    onChange={e => setCompany({ ...company, name: e.target.value })}
                                                    placeholder="Ma Société SAS"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Numéro TVA</Label>
                                                <Input
                                                    value={company.vatNumber}
                                                    onChange={e => setCompany({ ...company, vatNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Adresse *</Label>
                                            <Input
                                                value={company.address.street}
                                                onChange={e => setCompany({ ...company, address: { ...company.address, street: e.target.value } })}
                                                placeholder="10 Rue de la Paix"
                                                className="mb-2"
                                            />
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input
                                                    value={company.address.zip}
                                                    onChange={e => setCompany({ ...company, address: { ...company.address, zip: e.target.value } })}
                                                    placeholder="Code Postal"
                                                />
                                                <Input
                                                    value={company.address.city}
                                                    onChange={e => setCompany({ ...company, address: { ...company.address, city: e.target.value } })}
                                                    placeholder="Ville"
                                                    className="col-span-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-50 p-6 rounded-lg text-center space-y-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-400">
                                            <CreditCard className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">Coordonnées Bancaires</h3>
                                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                            Ces informations apparaîtront sur vos factures pour que vos clients puissent vous payer par virement.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>IBAN</Label>
                                            <Input
                                                value={company.iban}
                                                onChange={e => setCompany({ ...company, iban: e.target.value })}
                                                placeholder="FR76 ..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>BIC / SWIFT</Label>
                                            <Input
                                                value={company.bic}
                                                onChange={e => setCompany({ ...company, bic: e.target.value })}
                                                placeholder="XXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 text-center"
                                >
                                    <h3 className="text-lg font-medium text-slate-900">Votre Logo</h3>
                                    <p className="text-slate-500 text-sm">Ajoutez votre logo pour personnaliser vos documents.</p>

                                    <div
                                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('wizard-logo-upload')?.click()}
                                    >
                                        {company.logoUrl ? (
                                            <div className="relative w-32 h-32 mx-auto">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
                                                    alt="Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-4">
                                                <UploadCloud className="w-12 h-12 text-slate-300 mb-2" />
                                                <span className="text-indigo-600 font-medium">Cliquez pour ajouter</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="wizard-logo-upload"
                                            className="hidden"
                                            onChange={handleLogoUpload}
                                            accept="image/*"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={() => setStep(prev => prev - 1)}
                            disabled={step === 1}
                        >
                            Retour
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-slate-900 text-white hover:bg-slate-800 px-8"
                        >
                            {step === 3 ? (loading ? <Loader2 className="animate-spin" /> : "Terminer & Lancer 🚀") : "Continuer"}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
