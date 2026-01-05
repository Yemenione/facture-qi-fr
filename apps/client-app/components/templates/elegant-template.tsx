interface InvoiceData {
    invoiceNumber: string
    issueDate: Date
    dueDate: Date
    client: {
        name: string
        address: string
        city: string
        postalCode: string
    }
    company: {
        name: string
        address: string
        city: string
        postalCode: string
        siret: string
        email: string
        phone: string
    }
    items: Array<{
        description: string
        quantity: number
        unitPrice: number
        vatRate: number
        total: number
    }>
    subTotal: number
    taxAmount: number
    total: number
}

interface TemplateProps {
    data: InvoiceData
    template: {
        primaryColor: string
        secondaryColor: string
        textColor: string
        backgroundColor: string
        logoUrl?: string
        logoPosition: 'LEFT' | 'CENTER' | 'RIGHT'
        fontFamily: string
    }
}

export function ElegantTemplate({ data, template }: TemplateProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
    }

    return (
        <div
            className="w-full max-w-4xl mx-auto bg-white shadow-2xl"
            style={{
                fontFamily: template.fontFamily,
                color: template.textColor,
            }}
        >
            {/* Elegant Header with Gradient */}
            <div
                className="p-12 text-white relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`
                }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                    <div className="w-full h-full rounded-full border-8 border-white transform translate-x-20 -translate-y-20"></div>
                </div>
                <div className="relative z-10">
                    {template.logoUrl && (
                        <img src={template.logoUrl} alt="Logo" className="h-16 mb-6 brightness-0 invert" />
                    )}
                    <h1 className="text-6xl font-serif mb-2">FACTURE</h1>
                    <p className="text-xl opacity-90">{data.invoiceNumber}</p>
                </div>
            </div>

            <div className="p-12">
                {/* Company & Client Info */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <div className="mb-6">
                            <h3 className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: template.primaryColor }}>
                                De
                            </h3>
                            <p className="font-semibold text-lg mb-1">{data.company.name}</p>
                            <p className="text-sm opacity-70">{data.company.address}</p>
                            <p className="text-sm opacity-70">{data.company.postalCode} {data.company.city}</p>
                            <p className="text-sm opacity-70 mt-2">SIRET: {data.company.siret}</p>
                        </div>
                    </div>
                    <div>
                        <div className="mb-6">
                            <h3 className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: template.primaryColor }}>
                                Pour
                            </h3>
                            <p className="font-semibold text-lg mb-1">{data.client.name}</p>
                            <p className="text-sm opacity-70">{data.client.address}</p>
                            <p className="text-sm opacity-70">{data.client.postalCode} {data.client.city}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                                <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Date</p>
                                <p className="font-semibold">{formatDate(data.issueDate)}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Échéance</p>
                                <p className="font-semibold">{formatDate(data.dueDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Elegant Items Table */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2" style={{ borderColor: template.primaryColor }}>
                                <th className="text-left py-4 text-xs uppercase tracking-wider font-semibold" style={{ color: template.primaryColor }}>
                                    Description
                                </th>
                                <th className="text-right py-4 text-xs uppercase tracking-wider font-semibold" style={{ color: template.primaryColor }}>
                                    Qté
                                </th>
                                <th className="text-right py-4 text-xs uppercase tracking-wider font-semibold" style={{ color: template.primaryColor }}>
                                    Prix HT
                                </th>
                                <th className="text-right py-4 text-xs uppercase tracking-wider font-semibold" style={{ color: template.primaryColor }}>
                                    TVA
                                </th>
                                <th className="text-right py-4 text-xs uppercase tracking-wider font-semibold" style={{ color: template.primaryColor }}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-4">{item.description}</td>
                                    <td className="text-right py-4 opacity-70">{item.quantity}</td>
                                    <td className="text-right py-4 opacity-70">{formatCurrency(item.unitPrice)}</td>
                                    <td className="text-right py-4 opacity-70">{item.vatRate}%</td>
                                    <td className="text-right py-4 font-semibold">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Elegant Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-96">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between py-2">
                                <span className="opacity-70">Sous-total HT</span>
                                <span className="font-semibold">{formatCurrency(data.subTotal)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="opacity-70">TVA</span>
                                <span className="font-semibold">{formatCurrency(data.taxAmount)}</span>
                            </div>
                        </div>
                        <div
                            className="flex justify-between py-4 text-2xl font-serif border-t-2"
                            style={{ borderColor: template.primaryColor, color: template.primaryColor }}
                        >
                            <span>Total TTC</span>
                            <span className="font-bold">{formatCurrency(data.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Elegant Footer */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-6 text-sm text-center">
                        <div>
                            <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Email</p>
                            <p className="opacity-70">{data.company.email}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Téléphone</p>
                            <p className="opacity-70">{data.company.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Conditions</p>
                            <p className="opacity-70">Paiement à 30 jours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
