"use client"

import { ProductForm } from "@/components/products/product-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function NewProductPage() {
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nouveau Produit</h1>
                <p className="text-muted-foreground">Ajoutez un article ou une prestation à votre catalogue.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Détails du produit</CardTitle>
                    <CardDescription>
                        Ces informations seront utilisées pour pré-remplir vos factures.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm />
                </CardContent>
            </Card>
        </div>
    )
}
