"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Download, Mail, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import invoiceService from "@/services/invoice.service"
import { formatCurrency } from "@/lib/utils"

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadInvoices()
    }, [])

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.findAll()
            setInvoices(data)
        } catch (error) {
            console.error("Failed to load invoices", error)
        } finally {
            setLoading(false)
        }
    }

    const downloadInvoice = async (id: string, invoiceNumber: string) => {
        try {
            const blob = await invoiceService.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed", error);
            alert("Erreur lors du téléchargement");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
                    <p className="text-muted-foreground">Gérez vos factures et suivis de paiements.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/invoices/new">
                        <Plus className="mr-2 h-4 w-4" /> Créer une facture
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des factures</CardTitle>
                    <CardDescription>
                        Consultez l'historique de toutes vos factures émises.
                    </CardDescription>
                    <div className="pt-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher une facture..." className="pl-8 max-w-sm" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="h-12 px-4 align-middle font-medium">Numéro</th>
                                    <th className="h-12 px-4 align-middle font-medium">Client</th>
                                    <th className="h-12 px-4 align-middle font-medium">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium">Total TTC</th>
                                    <th className="h-12 px-4 align-middle font-medium">Statut</th>
                                    <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center">Chargement...</td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center">Aucune facture trouvée.</td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{invoice.invoiceNumber}</td>
                                            <td className="p-4 align-middle">{invoice.client?.name || 'Inconnu'}</td>
                                            <td className="p-4 align-middle">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 align-middle">{formatCurrency(invoice.total)}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Voir</span>
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber)}>
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Télécharger</span>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={async () => {
                                                        if (!confirm(`Envoyer la facture ${invoice.invoiceNumber} au client ?`)) return;
                                                        try {
                                                            await invoiceService.sendEmail(invoice.id);
                                                            alert('Email envoyé avec succès !');
                                                        } catch (e) {
                                                            console.error(e);
                                                            alert('Erreur lors de l\'envoi de l\'email.');
                                                        }
                                                    }}>
                                                        <Mail className="h-4 w-4" />
                                                        <span className="sr-only">Envoyer par Email</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
