"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import invoiceService from "@/services/invoice.service"
import { formatCurrency } from "@/lib/utils"

export default function InvoiceDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) loadInvoice()
    }, [id])

    const loadInvoice = async () => {
        try {
            const data = await invoiceService.findOne(id)
            setInvoice(data)
        } catch (error) {
            console.error("Failed to load invoice", error)
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
            <div className="bg-white border rounded-lg shadow-sm p-8 print:shadow-none print:border-0" id="invoice-preview">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-8 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{invoice.company.name}</h1>
                        <p className="text-sm text-gray-500">{invoice.company.email}</p>
                        {/* Add Company Address here (need to parse dynamic JSON if needed) */}
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-gray-900">FACTURE</h2>
                        <p className="text-gray-500">N° {invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Date: {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="mb-8">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Facturer à</h3>
                    <div className="text-gray-900 font-medium">{invoice.client.name}</div>
                    <div className="text-gray-500 text-sm">{invoice.client.email}</div>
                    {/* Address Display */}
                    {invoice.client.address && (
                        <div className="text-gray-500 text-sm mt-1">
                            {(invoice.client.address as any).street}, {(invoice.client.address as any).zip} {(invoice.client.address as any).city}
                        </div>
                    )}
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-semibold text-gray-900">Description</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-900">Qté</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-900">Prix Unit.</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-900">TVA</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-900">Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item: any) => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-3 px-2 text-gray-900">{item.description}</td>
                                <td className="py-3 px-2 text-right text-gray-600">{item.quantity}</td>
                                <td className="py-3 px-2 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                <td className="py-3 px-2 text-right text-gray-600">{item.vatRate}%</td>
                                <td className="py-3 px-2 text-right text-gray-900 font-medium">
                                    {formatCurrency(item.quantity * item.unitPrice)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Total HT</span>
                            <span>{formatCurrency(invoice.subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>TVA</span>
                            <span>{formatCurrency(invoice.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
                            <span>Total TTC</span>
                            <span>{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
