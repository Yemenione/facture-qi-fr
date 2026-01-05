"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Plus, Trash } from "lucide-react"

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


import { clientService } from "@/services/client.service"
import invoiceService from "@/services/invoice.service"
import { formatCurrency } from "@/lib/utils"

export default function NewInvoicePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<any[]>([])

    // Form State
    const [clientId, setClientId] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [items, setItems] = useState([
        { description: "", quantity: 1, unitPrice: 0, vatRate: 20 }
    ])

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        try {
            const data = await clientService.getAll()
            setClients(data)
        } catch (error) {
            console.error("Failed to load clients", error)
        }
    }

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, unitPrice: 0, vatRate: 20 }])
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
    }

    const calculateTotal = () => {
        return items.reduce((acc, item) => {
            const total = item.quantity * item.unitPrice * (1 + item.vatRate / 100)
            return acc + total
        }, 0)
    }

    const handleSubmit = async () => {
        if (!clientId) {
            alert("Veuillez sélectionner un client")
            return
        }

        setLoading(true)
        try {
            await invoiceService.create({
                clientId,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                items: items.map(item => ({
                    description: item.description,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice),
                    vatRate: Number(item.vatRate)
                }))
            })
            router.push("/dashboard/invoices")
        } catch (error) {
            console.error("Failed to create invoice", error)
            alert("Erreur lors de la création de la facture")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/invoices">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Nouvelle Facture</h1>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations Client</CardTitle>
                        <CardDescription>Sélectionnez le client pour cette facture.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="client">Client</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                            >
                                <option value="">Sélectionner un client...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lignes de facture</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="grid gap-4 md:grid-cols-12 items-end border p-4 rounded-lg bg-muted/10">
                                <div className="md:col-span-5 grid gap-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                        placeholder="Description du produit ou service"
                                    />
                                </div>
                                <div className="md:col-span-2 grid gap-2">
                                    <Label>Qté</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 grid gap-2">
                                    <Label>Prix Unit. (HT)</Label>
                                    <Input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 grid gap-2">
                                    <Label>TVA (%)</Label>
                                    <Input
                                        type="number"
                                        value={item.vatRate}
                                        onChange={(e) => handleItemChange(index, "vatRate", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <Button variant="destructive" size="icon" onClick={() => removeItem(index)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" onClick={addItem} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
                        </Button>

                        <div className="flex justify-end pt-4">
                            <div className="text-right">
                                <p className="text-lg font-bold">Total TTC Estimé:</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(calculateTotal())}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/invoices">Annuler</Link>
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Enregistrement..." : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Enregistrer la facture
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
