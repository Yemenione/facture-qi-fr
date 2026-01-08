"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Printer, CheckCircle, XCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import invoiceService from "@/services/invoice.service"
import templateService from "@/services/template.service"
import InvoiceRenderer from "@/components/templates/invoice-renderer"
import { formatCurrency } from "@/lib/utils"

export default function InvoiceDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [invoice, setInvoice] = useState<any>(null)
    const [template, setTemplate] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) loadData()
    }, [id])

    const loadData = async () => {
        try {
            const [invoiceData, templates] = await Promise.all([
                invoiceService.findOne(id),
                templateService.findAll()
            ])
            setInvoice(invoiceData)

            setInvoice(invoiceData)

            // Fallback template if none exists
            const fallbackTemplate = {
                fontFamily: 'Inter',
                primaryColor: '#000000',
                secondaryColor: '#666666',
                backgroundColor: '#ffffff',
                textColor: '#000000',
                headerStyle: 'DETAILED',
                logoPosition: 'LEFT',
                items: []
            };

            // Find default template or use the first one or fallback
            const defaultTemplate = (templates && templates.length > 0)
                ? (templates.find((t: any) => t.isDefault) || templates[0])
                : fallbackTemplate;

            setTemplate(defaultTemplate)
        } catch (error) {
            console.error("Failed to load data", error)
            alert("Facture introuvable")
            router.push("/dashboard/invoices")
        } finally {
            setLoading(false)
        }
    }

    const downloadPdf = async () => {
        try {
            const blob = await invoiceService.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error(error);
            alert("Erreur de téléchargement");
        }
    }

    const sendEmail = async () => {
        if (!confirm(`Envoyer la facture ${invoice.invoiceNumber} au client ?`)) return;
        try {
            await invoiceService.sendEmail(id);
            alert('Email envoyé avec succès !');
        } catch (e) {
            console.error(e);
            alert('Erreur lors de l\'envoi de l\'email.');
        }
    }

    const updateStatus = async (status: string) => {
        if (!confirm(`Changer le statut en ${status} ?`)) return;
        try {
            await invoiceService.updateStatus(id, status);
            loadData(); // Reload to show new status
        } catch (e) {
            console.error("Failed to update status", e);
            alert("Erreur lors de la mise à jour du statut");
        }
    }

    const handleCreateCreditNote = async () => {
        if (!confirm("Voulez-vous créer un avenant (Avoir) pour cette facture ?")) return;
        try {
            const creditNote = await invoiceService.createCreditNote(id);
            alert("Avoir créé avec succès !");
            router.push(`/dashboard/credit-notes/${creditNote.id}/edit`); // Redirect to edit the new credit note
        } catch (e) {
            console.error("Failed to create credit note", e);
            alert("Erreur lors de la création de l'avoir");
        }
    }

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.")) return;
        try {
            await invoiceService.delete(id);
            alert("Facture supprimée avec succès");
            router.push("/dashboard/invoices");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression");
        }
    }

    if (loading) return <div className="p-8 text-center">Chargement...</div>
    if (!invoice) return null

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header Actions */}
            <div className="hidden md:flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/invoices">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                        </Link>
                    </Button>
                    {(invoice.status === 'VALIDATED' || invoice.status === 'PAID') && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 animate-in fade-in slide-in-from-left-4">
                            <CheckCircle className="w-4 h-4" />
                            Certifié Factur-X
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    {/* Edit/Delete Desktop Actions */}
                    <div className="flex gap-2 border-r border-slate-200 pr-2 mr-2">
                        <Button variant="outline" asChild>
                            <Link href={`/dashboard/invoices/${id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" /> Modifier
                            </Link>
                        </Button>
                        <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </Button>
                    </div>

                    {invoice.status !== 'PAID' && (
                        <Button variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200" onClick={() => updateStatus('PAID')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Marquer Payée
                        </Button>
                    )}
                    {(invoice.status === 'VALIDATED' || invoice.status === 'PAID') && (
                        <Button variant="outline" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200" onClick={handleCreateCreditNote}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Créer un Avoir
                        </Button>
                    )}
                    {invoice.status !== 'CANCELLED' && (
                        <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => updateStatus('CANCELLED')}>
                            <XCircle className="mr-2 h-4 w-4" /> Annuler
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Imprimer
                    </Button>
                    <Button variant="outline" onClick={sendEmail}>
                        <Mail className="mr-2 h-4 w-4" /> Envoyer
                    </Button>
                    <Button onClick={downloadPdf}>
                        <Download className="mr-2 h-4 w-4" /> Télécharger PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Preview (Desktop) */}
            <div className="hidden md:block bg-white border rounded-lg shadow-sm print:shadow-none print:border-0 overflow-hidden" id="invoice-preview">
                {template ? (
                    <InvoiceRenderer
                        template={template}
                        data={{
                            invoiceNumber: invoice.invoiceNumber,
                            issueDate: invoice.issueDate || invoice.createdAt, // Pass raw ISO string/Date
                            dueDate: invoice.dueDate || null, // Pass raw ISO string/Date or null
                            companyName: invoice.company.name,
                            companyAddress: `${(invoice.company.address as any)?.street || ''}, ${(invoice.company.address as any)?.zip || ''} ${(invoice.company.address as any)?.city || ''}`,
                            companyEmail: invoice.company.email,
                            companyPhone: invoice.company.phone,
                            // Pass comprehensive legal info from Company Profile
                            companySiret: invoice.company.siret,
                            companyRcs: invoice.company.rcs,
                            companyVat: invoice.company.vatNumber,
                            companyCapital: invoice.company.capital,
                            companyIban: invoice.company.iban,
                            companyBic: invoice.company.bic,
                            companyLegalForm: invoice.company.legalForm,

                            clientName: invoice.client.name,
                            clientAddress: `${(invoice.client.address as any)?.street || ''}, ${(invoice.client.address as any)?.zip || ''} ${(invoice.client.address as any)?.city || ''}`,
                            clientEmail: invoice.client.email,
                            items: invoice.items.map((item: any) => ({
                                description: item.description,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                vatRate: item.vatRate
                            })),
                            subTotal: invoice.subTotal,
                            vatAmount: invoice.taxAmount,
                            total: invoice.total
                        }}
                    />
                ) : (
                    <div className="p-8 text-center text-gray-500">Chargement du modèle...</div>
                )}
            </div>

            {/* Mobile Native View - Premium Redesign */}
            <div className="md:hidden space-y-6 pb-24">
                {/* Header Card */}
                <Card className="bg-[#0F172A] border-white/10 overflow-hidden relative shadow-2xl shadow-black/50">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold to-brand-blue" />
                    <CardHeader className="pb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-white tracking-tight">{invoice.invoiceNumber}</h1>
                                <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-brand-gold/50"></span>
                                    {new Date(invoice.issueDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-sm ${invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                invoice.status === 'VALIDATED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-zinc-800/50 text-zinc-400 border-white/10'
                                }`}>
                                {invoice.status === 'PAID' ? 'PAYÉE' :
                                    invoice.status === 'VALIDATED' ? 'VALIDÉE' : invoice.status}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Client Section */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h3 className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-4 flex items-center gap-2">
                                <span className="w-1 h-3 bg-brand-gold rounded-full"></span> Client
                            </h3>
                            <div className="space-y-1 pl-3 border-l-2 border-white/10">
                                <p className="text-lg font-semibold text-white">{invoice.client.name}</p>
                                <p className="text-sm text-zinc-400">{invoice.client.email}</p>
                                <div className="text-sm text-zinc-500 mt-2 leading-relaxed">
                                    {(invoice.client.address as any)?.street}<br />
                                    {(invoice.client.address as any)?.city}
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4 border-b border-white/10 pb-2">Détails</h3>
                            <div className="space-y-4">
                                {invoice.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-start text-sm group">
                                        <div className="pr-4">
                                            <p className="text-zinc-200 font-medium group-hover:text-brand-gold transition-colors">{item.description}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">Qté: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                                        </div>
                                        <p className="font-mono text-white whitespace-nowrap font-medium">{formatCurrency(item.quantity * item.unitPrice)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Section - Highlighted */}
                        <div className="bg-gradient-to-br from-brand-dark to-slate-900 p-6 rounded-xl border border-white/10 shadow-inner">
                            <div className="flex justify-between text-sm text-zinc-400 mb-2">
                                <span>Sous-total HT</span>
                                <span>{formatCurrency(invoice.subTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400 mb-4 pb-4 border-b border-white/10">
                                <span>TVA (20%)</span>
                                <span>{formatCurrency(invoice.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white uppercase tracking-wider text-sm">Total TTC</span>
                                <span className="font-bold text-2xl text-brand-gold drop-shadow-sm">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Floating Action Buttons Area */}
                <div className="grid grid-cols-1 gap-3 sticky bottom-4">
                    <Button size="lg" className="w-full bg-brand-gold text-brand-dark font-bold shadow-lg shadow-brand-gold/20 hover:bg-yellow-500 h-12 text-base rounded-xl" onClick={downloadPdf}>
                        <Download className="mr-2 h-5 w-5" /> Télécharger PDF
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full bg-[#0F172A] text-white border-white/20 hover:bg-white/5 h-11 rounded-xl" onClick={sendEmail}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full bg-[#0F172A] text-white border-white/20 hover:bg-white/5 h-11 rounded-xl">
                                    <MoreHorizontal className="mr-2 h-4 w-4" /> Options
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#0F172A] border-white/10 text-white">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={() => window.open(`/dashboard/invoices/${id}/preview`, '_blank')} className="cursor-pointer hover:bg-white/5">
                                    <Printer className="mr-2 h-4 w-4" /> Aperçu Impression
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5">
                                    <Link href={`/dashboard/invoices/${id}/edit`} className="w-full flex items-center">
                                        <Pencil className="mr-2 h-4 w-4" /> Modifier
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300">
                                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                </DropdownMenuItem>
                                {invoice.status !== 'PAID' && (
                                    <DropdownMenuItem onClick={() => updateStatus('PAID')} className="cursor-pointer text-green-400 hover:text-green-300 hover:bg-green-500/10 focus:bg-green-500/10 focus:text-green-300">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Marquer Payée
                                    </DropdownMenuItem>
                                )}
                                {(invoice.status === 'VALIDATED' || invoice.status === 'PAID') && (
                                    <DropdownMenuItem onClick={handleCreateCreditNote} className="cursor-pointer text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 focus:bg-orange-500/10 focus:text-orange-300">
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Créer un Avoir
                                    </DropdownMenuItem>
                                )}
                                {invoice.status !== 'CANCELLED' && (
                                    <DropdownMenuItem onClick={() => updateStatus('CANCELLED')} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300">
                                        <XCircle className="mr-2 h-4 w-4" /> Annuler
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    )
}
