"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Printer, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

    if (loading) return <div className="p-8 text-center">Chargement...</div>
    if (!invoice) return null

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between no-print">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/invoices">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                    </Link>
                </Button>
                <div className="flex gap-2">
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

            {/* Invoice Preview */}
            <div className="bg-white border rounded-lg shadow-sm print:shadow-none print:border-0 overflow-hidden" id="invoice-preview">
                {template ? (
                    <InvoiceRenderer
                        template={template}
                        data={{
                            invoiceNumber: invoice.invoiceNumber,
                            issueDate: new Date(invoice.createdAt).toLocaleDateString(),
                            dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Non spécifiée',
                            companyName: invoice.company.name,
                            companyAddress: `${(invoice.company.address as any)?.street || ''}, ${(invoice.company.address as any)?.zip || ''} ${(invoice.company.address as any)?.city || ''}`,
                            companyEmail: invoice.company.email,
                            companyPhone: invoice.company.phone,
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
        </div>
    )
}
