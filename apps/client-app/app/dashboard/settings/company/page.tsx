"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CompanySettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-settings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            setSettings(data)
        } catch (error) {
            console.error('Failed to load settings', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(settings)
            })
            alert('Paramètres enregistrés avec succès!')
        } catch (error) {
            console.error('Failed to save settings', error)
            alert('Erreur lors de l\'enregistrement')
        } finally {
            setLoading(false)
        }
    }

    if (!settings) return <div className="p-8">Chargement...</div>

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/settings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Informations légales</h1>
                    <p className="text-muted-foreground">Gérez les informations légales de votre entreprise</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations légales */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Informations légales
                        </CardTitle>
                        <CardDescription>
                            Ces informations apparaîtront sur vos factures
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="legalName">Nom légal *</Label>
                                <Input
                                    id="legalName"
                                    value={settings.legalName || ''}
                                    onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="legalForm">Forme juridique *</Label>
                                <select
                                    id="legalForm"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    value={settings.legalForm || ''}
                                    onChange={(e) => setSettings({ ...settings, legalForm: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="EI">Entrepreneur Individuel (EI)</option>
                                    <option value="EURL">EURL</option>
                                    <option value="SARL">SARL</option>
                                    <option value="SAS">SAS</option>
                                    <option value="SASU">SASU</option>
                                    <option value="SA">SA</option>
                                    <option value="SNC">SNC</option>
                                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siret">SIRET *</Label>
                                <Input
                                    id="siret"
                                    value={settings.siret || ''}
                                    onChange={(e) => setSettings({ ...settings, siret: e.target.value })}
                                    placeholder="123 456 789 00012"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vatNumber">Numéro de TVA</Label>
                                <Input
                                    id="vatNumber"
                                    value={settings.vatNumber || ''}
                                    onChange={(e) => setSettings({ ...settings, vatNumber: e.target.value })}
                                    placeholder="FR12345678901"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capital">Capital social (€)</Label>
                                <Input
                                    id="capital"
                                    type="number"
                                    value={settings.capital || ''}
                                    onChange={(e) => setSettings({ ...settings, capital: parseFloat(e.target.value) })}
                                    placeholder="1000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rcs">RCS</Label>
                                <Input
                                    id="rcs"
                                    value={settings.rcs || ''}
                                    onChange={(e) => setSettings({ ...settings, rcs: e.target.value })}
                                    placeholder="RCS Paris B 123 456 789"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nafCode">Code NAF/APE</Label>
                            <Input
                                id="nafCode"
                                value={settings.nafCode || ''}
                                onChange={(e) => setSettings({ ...settings, nafCode: e.target.value })}
                                placeholder="6201Z"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Adresse */}
                <Card>
                    <CardHeader>
                        <CardTitle>Adresse</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse complète *</Label>
                            <Input
                                id="address"
                                value={settings.address || ''}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                placeholder="123 rue de la République"
                                required
                            />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Code postal *</Label>
                                <Input
                                    id="postalCode"
                                    value={settings.postalCode || ''}
                                    onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
                                    placeholder="75001"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville *</Label>
                                <Input
                                    id="city"
                                    value={settings.city || ''}
                                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                                    placeholder="Paris"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Pays *</Label>
                                <Input
                                    id="country"
                                    value={settings.country || 'France'}
                                    onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.email || ''}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone *</Label>
                                <Input
                                    id="phone"
                                    value={settings.phone || ''}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    placeholder="+33 1 23 45 67 89"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Site web</Label>
                            <Input
                                id="website"
                                value={settings.website || ''}
                                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Coordonnées bancaires */}
                <Card>
                    <CardHeader>
                        <CardTitle>Coordonnées bancaires</CardTitle>
                        <CardDescription>Pour les paiements par virement</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="iban">IBAN</Label>
                                <Input
                                    id="iban"
                                    value={settings.iban || ''}
                                    onChange={(e) => setSettings({ ...settings, iban: e.target.value })}
                                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bic">BIC</Label>
                                <Input
                                    id="bic"
                                    value={settings.bic || ''}
                                    onChange={(e) => setSettings({ ...settings, bic: e.target.value })}
                                    placeholder="BNPAFRPPXXX"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Nom de la banque</Label>
                            <Input
                                id="bankName"
                                value={settings.bankName || ''}
                                onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                                placeholder="BNP Paribas"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
