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
import productService from "@/services/product.service"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        vatRate: "20"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await productService.create({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                vatRate: parseFloat(formData.vatRate),
                unit: "Service" // Default for now
            })
            router.push("/dashboard/products")
        } catch (error) {
            console.error("Failed to create product", error)
            alert("Erreur lors de la création du produit")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Nouveau Produit</h1>
            </div>

            <div className="grid gap-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Détails du produit</CardTitle>
                        <CardDescription>Informations sur le produit ou service.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input id="name" placeholder="Ex: Développement Web" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" placeholder="Courte description..." value={formData.description} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Prix (HT)</Label>
                                <Input id="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="vatRate">TVA (%)</Label>
                                <Input id="vatRate" type="number" defaultValue="20" value={formData.vatRate} onChange={handleChange} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/products">Annuler</Link>
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Enregistrement..." : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Enregistrer le produit
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
