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

export function ClassicTemplate({ data, template }: TemplateProps) {
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
            className="w-full max-w-4xl mx-auto bg-white p-12 shadow-lg"
            style={{
                fontFamily: template.fontFamily,
                color: template.textColor,
                backgroundColor: template.backgroundColor
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-12 pb-6 border-b-2" style={{ borderColor: template.primaryColor }}>
                <div>
                    {template.logoUrl && template.logoPosition === 'LEFT' && (
                        <img src={template.logoUrl} alt="Logo" className="h-16 mb-4" />
                    )}
                    <h1 className="text-3xl font-bold mb-2" style={{ color: template.primaryColor }}>
                        FACTURE
                    </h1>
                    <p className="text-lg font-semibold">{data.invoiceNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-lg mb-2">{data.company.name}</h2>
                    <p className="text-sm">{data.company.address}</p>
                    <p className="text-sm">{data.company.postalCode} {data.company.city}</p>
                    <p className="text-sm mt-2">SIRET: {data.company.siret}</p>
                    <p className="text-sm">{data.company.email}</p>
                    <p className="text-sm">{data.company.phone}</p>
                </div>
            </div>

            {/* Client & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                    <h3 className="font-bold mb-2 text-sm uppercase" style={{ color: template.primaryColor }}>
                        Facturé à
                    </h3>
                    <p className="font-semibold">{data.client.name}</p>
                    <p className="text-sm">{data.client.address}</p>
                    <p className="text-sm">{data.client.postalCode} {data.client.city}</p>
                </div>
                <div>
                    <div className="mb-4">
                        <p className="text-sm font-semibold">Date d'émission</p>
                        <p>{formatDate(data.issueDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Date d'échéance</p>
                        <p>{formatDate(data.dueDate)}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr style={{ backgroundColor: template.primaryColor, color: 'white' }}>
                        <th className="text-left p-3">Description</th>
                        <th className="text-right p-3">Qté</th>
                        <th className="text-right p-3">P.U. HT</th>
                        <th className="text-right p-3">TVA</th>
                        <th className="text-right p-3">Total HT</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3">{item.description}</td>
                            <td className="text-right p-3">{item.quantity}</td>
                            <td className="text-right p-3">{formatCurrency(item.unitPrice)}</td>
                            <td className="text-right p-3">{item.vatRate}%</td>
                            <td className="text-right p-3 font-semibold">{formatCurrency(item.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-64">
                    <div className="flex justify-between py-2">
                        <span>Total HT</span>
                        <span className="font-semibold">{formatCurrency(data.subTotal)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>TVA</span>
                        <span className="font-semibold">{formatCurrency(data.taxAmount)}</span>
                    </div>
                    <div
                        className="flex justify-between py-3 text-lg font-bold border-t-2"
                        style={{ borderColor: template.primaryColor, color: template.primaryColor }}
                    >
                        <span>Total TTC</span>
                        <span>{formatCurrency(data.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 pt-6 border-t">
                <p>Paiement à 30 jours - En cas de retard, pénalités de 3 fois le taux d'intérêt légal</p>
            </div>
        </div>
    )
}
