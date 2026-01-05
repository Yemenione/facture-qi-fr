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

export function ModernTemplate({ data, template }: TemplateProps) {
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
            {/* Minimal Header */}
            <div className="flex justify-between items-start mb-16">
                <div>
                    {template.logoUrl && template.logoPosition === 'LEFT' && (
                        <img src={template.logoUrl} alt="Logo" className="h-12 mb-6" />
                    )}
                    <h1 className="text-5xl font-light tracking-wide mb-1" style={{ color: template.primaryColor }}>
                        FACTURE
                    </h1>
                    <p className="text-sm font-light opacity-60">{data.invoiceNumber}</p>
                </div>
                <div className="text-right text-sm space-y-1">
                    <p className="font-semibold">{data.company.name}</p>
                    <p className="opacity-60">{data.company.address}</p>
                    <p className="opacity-60">{data.company.postalCode} {data.company.city}</p>
                </div>
            </div>

            {/* Client & Dates - Side by Side */}
            <div className="grid grid-cols-2 gap-16 mb-16 pb-8 border-b" style={{ borderColor: `${template.primaryColor}20` }}>
                <div>
                    <p className="text-xs uppercase tracking-wider opacity-50 mb-3">Client</p>
                    <p className="font-semibold text-lg mb-1">{data.client.name}</p>
                    <p className="text-sm opacity-60">{data.client.address}</p>
                    <p className="text-sm opacity-60">{data.client.postalCode} {data.client.city}</p>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Émise le</p>
                        <p className="font-semibold">{formatDate(data.issueDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider opacity-50 mb-1">Échéance</p>
                        <p className="font-semibold">{formatDate(data.dueDate)}</p>
                    </div>
                </div>
            </div>

            {/* Items - Clean Table */}
            <div className="mb-12">
                <div className="grid grid-cols-12 gap-4 text-xs uppercase tracking-wider opacity-50 mb-4 pb-2 border-b" style={{ borderColor: `${template.primaryColor}20` }}>
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-right">Quantité</div>
                    <div className="col-span-2 text-right">Prix HT</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>
                {data.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 py-4 border-b" style={{ borderColor: `${template.primaryColor}10` }}>
                        <div className="col-span-6">
                            <p className="font-medium">{item.description}</p>
                            <p className="text-xs opacity-50 mt-1">TVA {item.vatRate}%</p>
                        </div>
                        <div className="col-span-2 text-right opacity-60">{item.quantity}</div>
                        <div className="col-span-2 text-right opacity-60">{formatCurrency(item.unitPrice)}</div>
                        <div className="col-span-2 text-right font-semibold">{formatCurrency(item.total)}</div>
                    </div>
                ))}
            </div>

            {/* Totals - Minimal Right Aligned */}
            <div className="flex justify-end mb-16">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between text-sm opacity-60">
                        <span>Sous-total HT</span>
                        <span>{formatCurrency(data.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm opacity-60">
                        <span>TVA</span>
                        <span>{formatCurrency(data.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-light pt-4 border-t" style={{ borderColor: template.primaryColor, color: template.primaryColor }}>
                        <span>Total TTC</span>
                        <span>{formatCurrency(data.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer - Minimal */}
            <div className="text-center text-xs opacity-40 pt-8 border-t" style={{ borderColor: `${template.primaryColor}10` }}>
                <p>{data.company.siret} • {data.company.email} • {data.company.phone}</p>
                <p className="mt-2">Paiement à 30 jours • Pénalités de retard : 3× taux légal</p>
            </div>
        </div>
    )
}
