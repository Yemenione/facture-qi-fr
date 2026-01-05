"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import productService, { Product } from "@/services/product.service"

const productSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    vatRate: z.coerce.number().min(0, "La TVA doit être positive"),
    unit: z.string().min(1, "L'unité est requise")
})

interface ProductFormProps {
    initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            price: 0,
            vatRate: 20,
            unit: "pièce"
        }
    })

    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        setLoading(true)
        try {
            if (initialData) {
                await productService.update(initialData.id, values)
                alert("Produit mis à jour !")
            } else {
                await productService.create(values)
                alert("Produit créé avec succès !")
            }
            router.push("/dashboard/products")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

            <div className="space-y-2">
                <Label htmlFor="name">Nom du produit / service</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Optionnel)</Label>
                <Textarea id="description" {...register("description")} placeholder="Description détaillée qui apparaîtra sur la facture..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Prix Unitaire HT (€)</Label>
                    <Input id="price" type="number" step="0.01" {...register("price")} />
                    {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="vatRate">Taux de TVA (%)</Label>
                    <Input id="vatRate" type="number" step="0.1" {...register("vatRate")} />
                    {errors.vatRate && <p className="text-sm text-red-500">{errors.vatRate.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="unit">Unité (ex: jour, heure, forfait, pièce)</Label>
                <Input id="unit" {...register("unit")} />
                {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Mettre à jour" : "Créer le produit"}
                </Button>
            </div>
        </form>
    )
}
