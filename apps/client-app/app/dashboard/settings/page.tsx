"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import companyService from "@/services/company.service"
import { useAuthStore } from "@/store/auth-store"
import { useToast } from "@/providers/toast-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Building2, Scale, CreditCard, Palette, Save, Search } from "lucide-react"

export default function SettingsPage() {
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [company, setCompany] = useState<any>({})

    const toast = useToast()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await companyService.get()
            const address = typeof data.address === 'string' ? { street: data.address } : data.address || {}
            setCompany({ ...data, address })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    // ...
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                ...company,
                address: company.address
            }
            await companyService.update(payload)
            toast.success("Paramètres mis à jour", "Vos informations ont été enregistrées avec succès.")
        } catch (error: any) {
            console.error("Update Error:", error)
            toast.error("Erreur de mise à jour", "Veuillez vérifier vos informations.")
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setCompany((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleAddressChange = (field: string, value: string) => {
        setCompany((prev: any) => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }))
    }

    const handleSiretSearch = async () => {
        if (!company.siret || company.siret.length < 9) {
            toast.warning("Numéro Invalide", "Veuillez saisir un numéro SIREN/SIRET valide.")
            return
        }
        try {
            const data = await companyService.searchSiret(company.siret)
            if (data) {
                setCompany((prev: any) => ({
                    ...prev,
                    name: data.name || prev.name,
                    rcs: data.rcs || prev.rcs,
                    vatNumber: data.vatNumber || prev.vatNumber,
                    capital: prev.capital, // API might not return this, keep existing
                    legalMentions: prev.legalMentions,
                    address: {
                        street: (data as any).street || prev.address?.street,
                        zip: (data as any).zipCode || prev.address?.zip,
                        city: (data as any).city || prev.address?.city,
                        country: "France"
                    }
                }))
                toast.success("Entreprise trouvée", "Les informations ont été pré-remplies.")
            }
        } catch (error) {
            console.error(error)
            toast.error("Entreprise introuvable", "Impossible de récupérer les informations pour ce SIRET.")
        }
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Paramètres de l'entreprise</h1>
                    <p className="text-slate-500 mt-1">Configurez vos informations légales et vos préférences.</p>
                </div>
                <Button onClick={onSubmit} disabled={saving} className="bg-slate-900 hover:bg-slate-800 shadow-lg">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
                </Button>
            </div>

            <form onSubmit={onSubmit}>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
                        <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"><Building2 className="w-4 h-4 mr-2" /> Général</TabsTrigger>
                        <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"><Scale className="w-4 h-4 mr-2" /> Juridique</TabsTrigger>
                        <TabsTrigger value="banking" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"><CreditCard className="w-4 h-4 mr-2" /> Banque</TabsTrigger>
                        <TabsTrigger value="branding" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"><Palette className="w-4 h-4 mr-2" /> Apparence</TabsTrigger>
                    </TabsList>

                    {/* GENERAL TAB */}
                    <TabsContent value="general" className="space-y-4 mt-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Informations Générales</CardTitle>
                                <CardDescription>Identité publique de votre entreprise.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom de l'entreprise</Label>
                                        <Input value={company.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email de contact</Label>
                                        <Input value={company.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Téléphone</Label>
                                        <Input value={company.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Site Web</Label>
                                        <Input value={company.website || ''} onChange={(e) => handleChange('website', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rue</Label>
                                    <Input value={company.address?.street || ''} onChange={(e) => handleAddressChange('street', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Code Postal</Label>
                                        <Input value={company.address?.zip || ''} onChange={(e) => handleAddressChange('zip', e.target.value)} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Ville</Label>
                                        <Input value={company.address?.city || ''} onChange={(e) => handleAddressChange('city', e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* LEGAL TAB */}
                    <TabsContent value="legal" className="space-y-4 mt-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Mentions Légales & Fiscales</CardTitle>
                                <CardDescription>Ces informations apparaîtront sur vos factures.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>SIREN / SIRET</Label>
                                        <div className="flex gap-2">
                                            <Input value={company.siret || ''} onChange={(e) => handleChange('siret', e.target.value)} placeholder="123 456 789 00012" />
                                            <Button type="button" variant="secondary" onClick={handleSiretSearch} title="Remplir automatiquement">
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Cliquez sur la loupe pour auto-remplir.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Numéro TVA Intracommunautaire</Label>
                                        <Input value={company.vatNumber || ''} onChange={(e) => handleChange('vatNumber', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>RCS / RM</Label>
                                        <Input value={company.rcs || ''} onChange={(e) => handleChange('rcs', e.target.value)} placeholder="ex: RCS Paris B 123 456 789" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Capital Social</Label>
                                        <Input value={company.capital || ''} onChange={(e) => handleChange('capital', e.target.value)} placeholder="ex: 1000 €" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mentions légales spécifiques (Pied de page)</Label>
                                    <Textarea
                                        value={company.legalMentions || ''}
                                        onChange={(e) => handleChange('legalMentions', e.target.value)}
                                        placeholder="Mentions obligatoires spécifiques à votre activité..."
                                        className="h-24"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* BANKING TAB */}
                    <TabsContent value="banking" className="space-y-4 mt-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Coordonnées Bancaires (RIB)</CardTitle>
                                <CardDescription>Pour permettre à vos clients de vous payer par virement.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>IBAN</Label>
                                    <Input value={company.iban || ''} onChange={(e) => handleChange('iban', e.target.value)} placeholder="FR76 ..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>BIC / SWIFT</Label>
                                    <Input value={company.bic || ''} onChange={(e) => handleChange('bic', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nom de la banque</Label>
                                    <Input placeholder="ex: BNP Paribas" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* BRANDING TAB */}
                    <TabsContent value="branding" className="space-y-4 mt-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Personnalisation</CardTitle>
                                <CardDescription>Ajoutez votre logo et définissez vos couleurs.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-full border shadow-sm">
                                            <Palette className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Modèles de Facture</h3>
                                            <p className="text-sm text-slate-500">Personnalisez le design de vos documents (couleurs, polices, mise en page).</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" asChild>
                                        <Link href="/dashboard/settings/templates">
                                            Gérer les modèles
                                        </Link>
                                    </Button>
                                </div>

                                <div
                                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer relative"
                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                >
                                    {company.logoUrl ? (
                                        <div className="relative w-40 h-40 mb-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
                                                alt="Company Logo"
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                                                <span className="text-white text-xs font-medium">Changer</span>
                                            </div>
                                        </div>
                                    ) : null}

                                    <input
                                        type="file"
                                        id="logo-upload"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                try {
                                                    const url = await companyService.uploadLogo(file);
                                                    setCompany((prev: any) => ({ ...prev, logoUrl: url }));
                                                    toast.success("Logo mis à jour", "Votre logo a été téléchargé avec succès.");
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error("Erreur", "Impossible de télécharger le logo.");
                                                }
                                            }
                                        }}
                                    />

                                    <div className="text-center">
                                        <div className="mt-2 text-sm text-slate-600">
                                            <span className="font-semibold text-blue-600">Cliquez pour uploader (Logo)</span> ou glissez-déposez
                                        </div>
                                        <p className="text-xs text-slate-500">Mettez votre logo ici (PNG, JPG)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    )
}
