"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Tag, Package, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import productService, { Product } from "@/services/product.service"
import { formatCurrency } from "@/lib/utils"

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const data = await productService.getAll()
            setProducts(data)
        } catch (error) {
            console.error("Failed to load products", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
        try {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-8">Chargement...</div>

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Catalogue Produits</h1>
                    <p className="text-zinc-400">Gérez vos articles et services récurrents.</p>
                </div>
                <Button asChild className="bg-brand-gold text-brand-dark font-bold rounded-full shadow-lg shadow-brand-gold/20 hover:bg-yellow-500">
                    <Link href="/dashboard/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Produit
                    </Link>
                </Button>
            </div>

            {/* Stats Cards (Mini Bento) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-400">Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{products.length}</div>
                    </CardContent>
                </Card>
                {/* Placeholders for future stats */}
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Prix Moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {products.length > 0 ? formatCurrency(products.reduce((acc, p) => acc + p.price, 0) / products.length) : '0 €'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List with Search */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Rechercher un produit..."
                        className="pl-10 max-w-sm rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 uppercase text-xs font-semibold border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Prix Unitaire</th>
                                <th className="px-6 py-4">TVA</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                        Aucun produit trouvé. Créez-en un nouveau !
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center text-zinc-400">
                                                    <Tag className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div>{product.name}</div>
                                                    <div className="text-xs text-zinc-500 font-normal truncate max-w-[200px]">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-200">
                                            {formatCurrency(product.price)}
                                            <span className="text-xs text-zinc-500 font-normal ml-1">/ {product.unit}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                                                {product.vatRate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" asChild className="hover:bg-white/5 hover:text-white text-zinc-400">
                                                <Link href={`/dashboard/products/${product.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
