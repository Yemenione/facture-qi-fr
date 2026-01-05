"use client"

import { useState, useEffect } from "react"
import companyService from "@/services/company.service"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [company, setCompany] = useState<any>({})

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await companyService.get()
            // Flat address mapping
            const address = typeof data.address === 'string' ? { street: data.address } : data.address || {}
            setCompany({ ...data, address })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            // Flatten address for API
            const payload = {
                ...company,
                address: company.address
            }
            await companyService.update(payload)
            alert("Paramètres mis à jour avec succès ✅")
        } catch (error: any) {
            console.error("Update Error:", error)
            alert("Erreur lors de la mise à jour")
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

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres de l'Entreprise</h1>
                <p className="text-muted-foreground">Gérez vos informations légales, coordonnées bancaires et préférences de facturation.</p>
            </div>

            <form onSubmit={onSubmit}>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">Général</TabsTrigger>
                        <TabsTrigger value="legal">Mentions Légales</TabsTrigger>
                        <TabsTrigger value="banking">Banque</TabsTrigger>
                        <TabsTrigger value="branding">Apparence</TabsTrigger>
                    </TabsList>

                    {/* GENERAL TAB */}
                    <TabsContent value="general" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations Générales</CardTitle>
                                <CardDescription>Identité de base de votre entreprise.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom de l'entreprise</Label>
                                        <Input value={company.name || ''} onChange={e => handleChange('name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email de contact</Label>
                                        <Input value={company.email || ''} onChange={e => handleChange('email', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Téléphone</Label>
                                        <Input value={company.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Adresse</Label>
                                    <Input placeholder="Numéro et rue" value={company.address?.street || ''} onChange={e => handleAddressChange('street', e.target.value)} />
                                    <div className="grid grid-cols-3 gap-4 mt-2">
                                        <Input placeholder="Code Postal" value={company.address?.zip || ''} onChange={e => handleAddressChange('zip', e.target.value)} />
                                        <Input placeholder="Ville" className="col-span-2" value={company.address?.city || ''} onChange={e => handleAddressChange('city', e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* LEGAL TAB */}
                    <TabsContent value="legal" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mentions Légales Obligatoires (2026)</CardTitle>
                                <CardDescription>Ces informations doivent apparaître sur vos factures pour être conformes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>SIREN</Label>
                                        <Input value={company.siren || ''} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SIRET</Label>
                                        <Input value={company.siret || ''} onChange={e => handleChange('siret', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Numéro de TVA Intracommunautaire</Label>
                                        <Input value={company.vatNumber || ''} onChange={e => handleChange('vatNumber', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Forme Juridique (ex: SAS, EURL)</Label>
                                        <Input value={company.legalForm || ''} onChange={e => handleChange('legalForm', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Capital Social (ex: 1000)</Label>
                                        <Input value={company.capital || ''} onChange={e => handleChange('capital', e.target.value)} placeholder="Montant en €" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ville d'immatriculation (RCS)</Label>
                                        <Input value={company.rcs || ''} onChange={e => handleChange('rcs', e.target.value)} placeholder="ex: Paris" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mentions Légales (Pied de page)</Label>
                                    <Textarea
                                        placeholder="Ex: SAS au capital de 1000€ - RCS Paris B 123 456 789 - TVA FR 12 123456789"
                                        value={company.legalMentions || ''}
                                        onChange={e => handleChange('legalMentions', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Texte qui apparaîtra en bas de chaque page de la facture.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Conditions Pénalités de Retard</Label>
                                    <Input
                                        placeholder="Ex: 3 fois le taux d'intérêt légal. Indemnité forfaitaire de 40€."
                                        value={company.penalties || ''}
                                        onChange={e => handleChange('penalties', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* BANKING TAB */}
                    <TabsContent value="banking" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Coordonnées Bancaires</CardTitle>
                                <CardDescription>Pour permettre à vos clients de vous payer par virement.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>IBAN</Label>
                                    <Input value={company.iban || ''} onChange={e => handleChange('iban', e.target.value)} placeholder="FR76 ...." />
                                </div>
                                <div className="space-y-2">
                                    <Label>BIC / SWIFT</Label>
                                    <Input value={company.bic || ''} onChange={e => handleChange('bic', e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* BRANDING TAB */}
                    <TabsContent value="branding" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Apparence</CardTitle>
                                <CardDescription>Personnalisez vos documents.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Logo (URL)</Label>
                                    <Input value={company.logoUrl || ''} onChange={e => handleChange('logoUrl', e.target.value)} placeholder="https://..." />
                                    {company.logoUrl && (
                                        <div className="mt-4 p-4 border rounded bg-gray-50 flex justify-center">
                                            <img src={company.logoUrl} alt="Preview" className="h-20 object-contain" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" size="lg" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer les modifications
                    </Button>
                </div>
            </form>
        </div>
    )
}
