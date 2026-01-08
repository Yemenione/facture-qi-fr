"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Download, Mail, Eye, FileText, FileClock, FileWarning, Pencil, Trash2, FileSpreadsheet } from "lucide-react"
import { getCookie } from "cookies-next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import invoiceService from "@/services/invoice.service"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/providers/toast-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        loadInvoices()
    }, [])

    useEffect(() => {
        if (!searchQuery) {
            setFilteredInvoices(invoices)
        } else {
            const lower = searchQuery.toLowerCase()
            setFilteredInvoices(invoices.filter(inv =>
                inv.invoiceNumber?.toLowerCase().includes(lower) ||
                inv.client?.name?.toLowerCase().includes(lower)
            ))
        }
    }, [searchQuery, invoices])

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.findAll()
            setInvoices(data)
            setFilteredInvoices(data)
        } catch (error) {
            console.error("Failed to load invoices", error)
        } finally {
            setLoading(false)
        }
    }

    const handleBulkExport = async (format: 'xlsx' | 'csv') => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data-ops/export/invoices?format=${format}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.${format}`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Export Successful", `Downloaded ${format.toUpperCase()} file.`);
        } catch (error) {
            toast.error("Export Failed", "Could not export data.");
        }
    }

    const downloadInvoice = async (id: string, invoiceNumber: string, format: 'pdf' | 'facturx' | 'xml' | 'excel' = 'pdf') => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error("Erreur", "Vous n'êtes pas connecté");
                return;
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}/pdf?format=${format}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            let ext = 'pdf';
            if (format === 'xml') ext = 'xml';
            if (format === 'excel') ext = 'xlsx';

            a.download = `invoice-${invoiceNumber}${format === 'facturx' ? '-fx' : ''}.${ext}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Téléchargement lancé", `Format: ${format.toUpperCase()}`);
        } catch (error) {
            console.error("Download failed", error);
            toast.error("Erreur", "Le téléchargement a échoué.");
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

    const deleteInvoice = async (id: string, invoiceNumber: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${invoiceNumber} ?`)) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert("Facture supprimée avec succès!");
            loadInvoices(); // Reload list
        } catch (error) {
            console.error("Delete failed", error);
            alert("Erreur lors de la suppression");
        }
    }

    if (loading) return <div className="p-8 text-white">Chargement...</div>

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2 pb-20 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-heading font-bold tracking-tight text-white">Documents</h1>
                    <p className="text-zinc-400 mt-1">Factures, Devis et Avoirs centralisés.</p>
                </div>
                <div className="flex gap-2">

                    <Button asChild className="bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20 hover:bg-yellow-500 rounded-full font-bold">
                        <Link href="/dashboard/invoices/new">
                            <Plus className="mr-2 h-4 w-4" /> Créer un document
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Factures à payer</CardTitle>
                        <FileWarning className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {invoices.filter(i => i.status !== 'PAID' && i.type === 'INVOICE').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Devis en cours</CardTitle>
                        <FileClock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {invoices.filter(i => i.type === 'QUOTE').length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Avoirs</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {invoices.filter(i => i.type === 'CREDIT_NOTE').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main List */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Rechercher par numéro ou client..."
                        className="pl-10 max-w-sm rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:ring-brand-gold focus:border-brand-gold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="hidden md:block rounded-xl border border-white/10 bg-white/5 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="h-10 px-6 font-medium text-zinc-400">Type & Numéro</th>
                                <th className="h-10 px-6 font-medium text-zinc-400">Client</th>
                                <th className="h-10 px-6 font-medium text-zinc-400">Date</th>
                                <th className="h-10 px-6 font-medium text-zinc-400">Montant TTC</th>
                                <th className="h-10 px-6 font-medium text-zinc-400">Statut</th>
                                <th className="h-10 px-6 font-medium text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-96">
                                        <div className="flex flex-col items-center justify-center text-center h-full text-zinc-500">
                                            <div className="bg-white/5 p-6 rounded-full mb-4">
                                                <FileText className="h-12 w-12 text-zinc-700" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">Aucun document pour le moment</h3>
                                            <p className="max-w-sm mt-2 text-sm text-zinc-400">
                                                Commencez par créer votre première facture ou devis pour voir apparaître vos données ici.
                                            </p>
                                            <Button asChild className="mt-6 bg-brand-gold hover:bg-yellow-500 text-brand-dark shadow-lg shadow-brand-gold/20 font-bold">
                                                <Link href="/dashboard/invoices/new">
                                                    <Plus className="mr-2 h-4 w-4" /> Créer mon premier document
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded flex items-center justify-center
                                                    ${invoice.type === 'QUOTE' ? 'bg-blue-500/20 text-blue-400' :
                                                        invoice.type === 'CREDIT_NOTE' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-zinc-400'}
                                                `}>
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white">{invoice.invoiceNumber || 'BROUILLON'}</span>
                                                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                                                        {invoice.type === 'QUOTE' ? 'DEVIS' : invoice.type === 'CREDIT_NOTE' ? 'AVOIR' : 'FACTURE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-medium text-zinc-300">{invoice.client?.name}</td>
                                        <td className="p-4 align-middle text-zinc-500">{new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</td>
                                        <td className="p-4 align-middle font-bold text-white">{formatCurrency(invoice.total)}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                ${invoice.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
                                                    invoice.status === 'VALIDATED' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-white/10 text-zinc-400'}
                                            `}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" asChild className="hover:text-brand-gold hover:bg-white/5 text-zinc-400">
                                                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                {invoice.status !== 'PAID' && (
                                                    <Button variant="ghost" size="icon" asChild className="hover:text-white hover:bg-white/5 text-zinc-400">
                                                        <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}

                                                <Button variant="ghost" size="icon" onClick={() => sendEmail(invoice.id, invoice.client?.email)} className="hover:text-brand-blue hover:bg-white/5 text-zinc-400">
                                                    <Mail className="h-4 w-4" />
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:text-white hover:bg-white/5 text-zinc-400">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-brand-dark border-white/10 text-zinc-300">
                                                        <DropdownMenuItem onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber, 'pdf')} className="hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                                                            <FileText className="mr-2 h-4 w-4" /> PDF Standard
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber, 'facturx')} className="text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue focus:bg-brand-blue/10 focus:text-brand-blue">
                                                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Factur-X (2026)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber, 'xml')} className="hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                                                            <FileWarning className="mr-2 h-4 w-4" /> XML Données
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber, 'excel')} className="hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                                                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel (Détail)
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                {invoice.status === 'DRAFT' && (
                                                    <Button variant="ghost" size="icon" onClick={() => deleteInvoice(invoice.id, invoice.invoiceNumber)} className="hover:text-red-400 hover:bg-red-500/10 text-zinc-400">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4 pb-20">
                    {filteredInvoices.map((invoice) => (
                        <Link href={`/dashboard/invoices/${invoice.id}`} key={invoice.id} className="block">
                            <Card className="bg-white/5 border-white/10 active:scale-[0.98] transition-transform">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center border border-white/5 shadow-inner ${invoice.type === 'QUOTE' ? 'bg-blue-500/20 text-blue-400' :
                                                invoice.type === 'CREDIT_NOTE' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-zinc-400'
                                                }`}>
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg">{invoice.invoiceNumber || 'BROUILLON'}</div>
                                                <div className="text-xs text-zinc-500 font-bold tracking-wider">
                                                    {invoice.type === 'QUOTE' ? 'DEVIS' : invoice.type === 'CREDIT_NOTE' ? 'AVOIR' : 'FACTURE'}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${invoice.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            invoice.status === 'VALIDATED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-white/10 text-zinc-400 border-white/10'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                        <div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Client</div>
                                            <div className="font-medium text-white">{invoice.client?.name}</div>
                                            <div className="text-xs text-zinc-600 mt-1">{new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total TTC</div>
                                            <div className="font-bold text-xl text-brand-gold">{formatCurrency(invoice.total)}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {filteredInvoices.length === 0 && (
                        <div className="text-center py-12 text-zinc-500 bg-white/5 rounded-xl border border-white/10">
                            <p>Aucun document trouvé.</p>
                            <Button asChild className="mt-4 bg-brand-gold text-brand-dark font-bold">
                                <Link href="/dashboard/invoices/new">Créer</Link>
                            </Button>
                        </div>
                    )}
                </div>


            </div>
        </div>
    )
}
