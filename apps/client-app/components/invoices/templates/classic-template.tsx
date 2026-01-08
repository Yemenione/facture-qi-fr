import React from "react"
import { InvoiceTemplateProps } from "./types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils"

export const ClassicTemplate: React.FC<InvoiceTemplateProps> = ({
    invoice,
    customization = {}
}) => {
    const {
        primaryColor = "#000000",
        logoPosition = "LEFT",
        fontFamily = "Inter"
    } = customization

    const formatDate = (date: Date | string | null) => {
        if (!date) return ""
        return format(new Date(date), "dd MMMM yyyy", { locale: fr })
    }

    const company = invoice.company
    const client = invoice.client
    // Parse addresses if stored as JSON (Prisma JSON type comes as object in runtime, but let's be safe)
    const companyAddress = typeof company.address === 'string' ? JSON.parse(company.address) : company.address as any
    const clientAddress = typeof client.address === 'string' ? JSON.parse(client.address) : client.address as any

    return (
        <div
            className="w-full bg-white text-sm"
            style={{
                fontFamily,
                minHeight: '297mm', // A4 height
                padding: '40px',
                color: '#333'
            }}
        >
            {/* Header */}
            <header className={`flex flex-col gap-6 mb-12 ${logoPosition === 'CENTER' ? 'items-center text-center' : logoPosition === 'RIGHT' ? 'items-end text-right' : 'items-start'}`}>
                <div className="flex w-full justify-between items-start">
                    {/* Logo & Company Info */}
                    <div className={`flex flex-col gap-4 ${logoPosition === 'RIGHT' ? 'order-2 items-end' : ''} ${logoPosition === 'CENTER' ? 'w-full items-center' : 'w-1/2'}`}>
                        {company.logoUrl && (
                            <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="h-20 w-auto object-contain"
                            />
                        )}
                        <div className={logoPosition === 'CENTER' ? 'text-center' : ''}>
                            <h2 className="font-bold text-lg mb-1" style={{ color: primaryColor }}>{company.name}</h2>
                            <p className="whitespace-pre-line text-gray-500 text-xs">
                                {companyAddress?.street}<br />
                                {companyAddress?.zipCode} {companyAddress?.city}<br />
                                {companyAddress?.country}
                            </p>
                            <div className="mt-2 text-xs text-gray-500">
                                {company.email && <p>Email: {company.email}</p>}
                                {company.phone && <p>Tél: {company.phone}</p>}
                                {company.siret && <p>SIRET: {company.siret}</p>}
                                {company.vatNumber && <p>TVA: {company.vatNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Invoice Info (Always Top Right in Classic unless Logo is Right) */}
                    {logoPosition !== 'CENTER' && (
                        <div className={`flex flex-col ${logoPosition === 'RIGHT' ? 'order-1 items-start text-left' : 'items-end text-right'} w-1/2`}>
                            <h1 className="text-3xl font-light uppercase tracking-widest mb-4" style={{ color: primaryColor }}>
                                {invoice.type === 'QUOTE' ? 'DEVIS' : 'FACTURE'}
                            </h1>
                            <div className="space-y-1">
                                <p><span className="font-medium">N° :</span> {invoice.invoiceNumber}</p>
                                <p><span className="font-medium">Date :</span> {formatDate(invoice.issueDate)}</p>
                                {invoice.dueDate && <p><span className="font-medium">Échéance :</span> {formatDate(invoice.dueDate)}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Client Info */}
            <div className="flex justify-end mb-16">
                <div className="w-1/2 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Facturé à</p>
                    <h3 className="font-bold text-lg mb-2">{client.name}</h3>
                    <p className="whitespace-pre-line text-gray-600">
                        {clientAddress?.street || clientAddress?.billing?.street}<br />
                        {clientAddress?.zipCode || clientAddress?.billing?.zipCode} {clientAddress?.city || clientAddress?.billing?.city}<br />
                        {clientAddress?.country || clientAddress?.billing?.country}
                    </p>
                    {client.vatNumber && <p className="mt-2 text-xs text-gray-500">TVA: {client.vatNumber}</p>}
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-12">
                <thead>
                    <tr style={{ borderBottom: `2px solid ${primaryColor}` }}>
                        <th className="py-3 text-left font-semibold text-gray-700 w-[50%]">Désignation</th>
                        <th className="py-3 text-right font-semibold text-gray-700">Qté</th>
                        <th className="py-3 text-right font-semibold text-gray-700">Prix Unit. HT</th>
                        <th className="py-3 text-right font-semibold text-gray-700">TVA</th>
                        <th className="py-3 text-right font-semibold text-gray-700">Total HT</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item: any, index: number) => (
                        <tr key={index}>
                            <td className="py-4 text-gray-800">{item.description}</td>
                            <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                            <td className="py-4 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-4 text-right text-gray-600">{item.vatRate}%</td>
                            <td className="py-4 text-right font-medium text-gray-800">{formatCurrency(item.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Total HT</span>
                        <span>{formatCurrency(invoice.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>TVA</span>
                        <span>{formatCurrency(invoice.taxAmount)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-bold text-lg">Total TTC</span>
                        <span className="font-bold text-xl" style={{ color: primaryColor }}>{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Legal */}
            <div className="mt-auto border-t pt-8 text-xs text-gray-500 text-center">
                <div className="mb-4 space-y-1">
                    {company.settings?.iban && <p>IBAN: {company.settings.iban} | BIC: {company.settings.bic}</p>}
                    {invoice.terms && <p className="font-medium">Conditions: {invoice.terms}</p>}
                </div>
                <p>
                    {company.name} - {company.legalForm} au capital de {company.capital} - SIRET {company.siret} - RCS {company.rcsNumber}
                    <br />
                    TVA Intracommunautaire: {company.vatNumber}
                    <br />
                    {company.settings?.defaultLegalMention || "Membre d'une association agréée, le règlement des honoraires par chèque est accepté."}
                </p>
            </div>
        </div>
    )
}
