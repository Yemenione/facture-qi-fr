"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Download, Mail, Eye, FileText, FileClock, FileWarning, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

    const sendEmail = async (id: string, email?: string) => {
        if (!email) {
            alert("Ce client n'a pas d'email configuré.");
            return;
        }
        if (!confirm(`Envoyer la facture par email à ${email} ?`)) return;

        try {
            await invoiceService.sendEmail(id);
            alert("Email envoyé avec succès !");
        } catch (e) {
            alert("Erreur lors de l'envoi de l'email.");
        }
    }

    if (loading) return <div className="p-8">Chargement...</div>

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Documents</h1>
                    <p className="text-slate-500 mt-1">Factures, Devis et Avoirs centralisés.</p>
                </div>
                <Button asChild className="bg-slate-900 shadow-lg hover:bg-slate-800 rounded-full">
                    <Link href="/dashboard/invoices/new">
                        <Plus className="mr-2 h-4 w-4" /> Créer un document
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Factures à payer</CardTitle>
                        <FileWarning className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {invoices.filter(i => i.status !== 'PAID' && i.type === 'INVOICE').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Devis en cours</CardTitle>
                        <FileClock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {invoices.filter(i => i.type === 'QUOTE').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Avoirs</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {invoices.filter(i => i.type === 'CREDIT_NOTE').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main List */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par numéro ou client..."
                        className="pl-10 max-w-sm rounded-full bg-white border-slate-200 focus:ring-slate-900"
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="h-10 px-6 font-medium text-slate-500">Type & Numéro</th>
                                <th className="h-10 px-6 font-medium text-slate-500">Client</th>
                                <th className="h-10 px-6 font-medium text-slate-500">Date</th>
                                <th className="h-10 px-6 font-medium text-slate-500">Montant TTC</th>
                                <th className="h-10 px-6 font-medium text-slate-500">Statut</th>
                                <th className="h-10 px-6 font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        Aucun document trouvé.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded flex items-center justify-center
                                                    ${invoice.type === 'QUOTE' ? 'bg-blue-100 text-blue-600' :
                                                        invoice.type === 'CREDIT_NOTE' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}
                                                `}>
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{invoice.invoiceNumber || 'BROUILLON'}</span>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                        {invoice.type === 'QUOTE' ? 'DEVIS' : invoice.type === 'CREDIT_NOTE' ? 'AVOIR' : 'FACTURE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-medium text-slate-700">{invoice.client?.name}</td>
                                        <td className="p-4 align-middle text-slate-500">{new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</td>
                                        <td className="p-4 align-middle font-bold text-slate-900">{formatCurrency(invoice.total)}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'VALIDATED' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-slate-100 text-slate-800'}
                                            `}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" asChild className="hover:text-blue-600">
                                                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                {invoice.status !== 'PAID' && (
                                                    <Button variant="ghost" size="icon" asChild className="hover:text-slate-900">
                                                        <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}

                                                <Button variant="ghost" size="icon" onClick={() => sendEmail(invoice.id, invoice.client?.email)} className="hover:text-indigo-600">
                                                    <Mail className="h-4 w-4" />
                                                </Button>

                                                <Button variant="ghost" size="icon" onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber)} className="hover:text-slate-900">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
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
