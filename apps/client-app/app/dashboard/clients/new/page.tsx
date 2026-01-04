"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import clientService from "@/services/client.service"

export default function NewClientPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        zip: "",
        city: "",
        country: "France",
        siren: "",
        vatNumber: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await clientService.create({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                siren: formData.siren,
                vatNumber: formData.vatNumber,
                address: {
                    street: formData.address,
                    zip: formData.zip,
                    city: formData.city,
                    country: formData.country
                }
            })
            router.push("/dashboard/clients")
        } catch (error) {
            console.error("Failed to create client", error)
            alert("Erreur lors de la création du client")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Nouveau Client</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations Générales</CardTitle>
                        <CardDescription>Coordonnées principales du client.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom de l'entreprise / Client</Label>
                            <Input id="name" placeholder="Ex: Acme Corp" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="contact@client.com" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" type="tel" placeholder="+33 6..." value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="siren">SIREN</Label>
                                <Input id="siren" placeholder="123456789" value={formData.siren} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="vatNumber">TVA (Optionnel)</Label>
                                <Input id="vatNumber" placeholder="FR..." value={formData.vatNumber} onChange={handleChange} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Adresse</CardTitle>
                        <CardDescription>Pour la facturation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address">Rue</Label>
                            <Input id="address" placeholder="123 Avenue des Champs-Élysées" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="zip">Code Postal</Label>
                                <Input id="zip" placeholder="75008" value={formData.zip} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input id="city" placeholder="Paris" value={formData.city} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Pays</Label>
                            <Input id="country" value={formData.country} onChange={handleChange} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/clients">Annuler</Link>
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Enregistrement..." : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Enregistrer le client
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
