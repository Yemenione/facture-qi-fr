"use client"

import { useState, useEffect } from "react"
import companyService from "@/services/company.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [company, setCompany] = useState<any>({})

    // Load initial data
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await companyService.get()
            setCompany(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitCompany = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await companyService.update(company)
            alert("Entreprise mise à jour !")
        } catch (error) {
            alert("Erreur lors de la mise à jour")
        }
    }

    if (loading) return <div>Chargement...</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">Gérez votre profil et les préférences de votre entreprise.</p>
            </div>

            <div className="grid gap-6">
                {/* User Profile Section - Placeholder for now as API focus is Company */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profil Utilisateur</CardTitle>
                        <CardDescription>
                            Vos informations personnelles et de connexion.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" defaultValue="Jean" disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" defaultValue="Dupont" disabled />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="jean.dupont@company.com" disabled />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button disabled>Sauvegarder (Bientôt)</Button>
                    </CardFooter>
                </Card>

                {/* Company Settings Section - Active */}
                <form onSubmit={onSubmitCompany}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de l'entreprise</CardTitle>
                            <CardDescription>
                                Détails affichés sur vos factures (Obligatoire pour la conformité).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                                <Input
                                    id="companyName"
                                    value={company.name || ''}
                                    onChange={e => setCompany({ ...company, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="siren">SIREN</Label>
                                    <Input
                                        id="siren"
                                        placeholder="Ex: 123 456 789"
                                        value={company.siren || ''}
                                        onChange={e => setCompany({ ...company, siren: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="vatNumber">Numéro TVA</Label>
                                    <Input
                                        id="vatNumber"
                                        placeholder="Ex: FR 12 123456789"
                                        value={company.vatNumber || ''}
                                        onChange={e => setCompany({ ...company, vatNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    placeholder="+33 1 23 45 67 89"
                                    value={company.phone || ''}
                                    onChange={e => setCompany({ ...company, phone: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="companyAddress">Adresse complète</Label>
                                <Input
                                    id="companyAddress"
                                    placeholder="123 Rue de la Paix"
                                    value={company.address?.street || company.address || ''}
                                    onChange={e => setCompany({ ...company, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="zipCode">Code Postal</Label>
                                    <Input
                                        id="zipCode"
                                        value={company.zipCode || ''}
                                        onChange={e => setCompany({ ...company, zipCode: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <Label htmlFor="city">Ville</Label>
                                    <Input
                                        id="city"
                                        value={company.city || ''}
                                        onChange={e => setCompany({ ...company, city: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit">Sauvegarder les modifications</Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}
