"use client"

import { useEffect, useState } from "react"
import { ProductForm } from "@/components/products/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import productService, { Product } from "@/services/product.service"
import { Loader2 } from "lucide-react"

export default function EditProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const products = await productService.getAll()
                const found = products.find((p: Product) => p.id === params.id)
                setProduct(found || null)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [params.id])

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    if (!product) return <div>Produit introuvable</div>

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Modifier Produit</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm initialData={product} />
                </CardContent>
            </Card>
        </div>
    )
}
