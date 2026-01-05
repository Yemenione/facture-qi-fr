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

export function ColorfulTemplate({ data, template }: TemplateProps) {
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
            className="w-full max-w-4xl mx-auto bg-white p-12 shadow-lg relative overflow-hidden"
            style={{
                fontFamily: template.fontFamily,
                color: template.textColor,
            }}
        >
            {/* Colorful Accent Bar */}
            <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                    background: `linear-gradient(90deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`
                }}
            />

            {/* Colorful Header */}
            <div className="mb-12">
                <div className="flex justify-between items-start">
                    <div>
                        {template.logoUrl && template.logoPosition === 'LEFT' && (
                            <img src={template.logoUrl} alt="Logo" className="h-14 mb-4" />
                        )}
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-5xl font-bold" style={{ color: template.primaryColor }}>
                                FACTURE
                            </h1>
                            <div
                                className="px-4 py-1 rounded-full text-white text-sm font-semibold"
                                style={{ backgroundColor: template.secondaryColor }}
                            >
                                {data.invoiceNumber}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg mb-1">{data.company.name}</p>
                        <p className="text-sm opacity-70">{data.company.address}</p>
                        <p className="text-sm opacity-70">{data.company.postalCode} {data.company.city}</p>
                    </div>
                </div>
            </div>

            {/* Colorful Info Cards */}
            <div className="grid grid-cols-2 gap-6 mb-12">
                <div
                    className="p-6 rounded-xl border-l-4"
                    style={{
                        backgroundColor: `${template.primaryColor}10`,
                        borderColor: template.primaryColor
                    }}
                >
                    <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: template.primaryColor }}>
                        Facturé à
                    </p>
                    <p className="font-bold text-lg mb-1">{data.client.name}</p>
                    <p className="text-sm opacity-70">{data.client.address}</p>
                    <p className="text-sm opacity-70">{data.client.postalCode} {data.client.city}</p>
                </div>
                <div
                    className="p-6 rounded-xl border-l-4"
                    style={{
                        backgroundColor: `${template.secondaryColor}10`,
                        borderColor: template.secondaryColor
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: template.secondaryColor }}>
                                Date d'émission
                            </p>
                            <p className="font-bold">{formatDate(data.issueDate)}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: template.secondaryColor }}>
                                Échéance
                            </p>
                            <p className="font-bold">{formatDate(data.dueDate)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Colorful Items */}
            <div className="mb-12">
                <div
                    className="grid grid-cols-12 gap-4 p-4 rounded-lg text-white text-sm font-semibold mb-2"
                    style={{ backgroundColor: template.primaryColor }}
                >
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-center">Quantité</div>
                    <div className="col-span-2 text-right">Prix HT</div>
                    <div className="col-span-1 text-center">TVA</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>
                {data.items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-12 gap-4 p-4 rounded-lg mb-2 hover:shadow-md transition-shadow"
                        style={{ backgroundColor: index % 2 === 0 ? `${template.primaryColor}05` : 'transparent' }}
                    >
                        <div className="col-span-5 font-medium">{item.description}</div>
                        <div className="col-span-2 text-center opacity-70">{item.quantity}</div>
                        <div className="col-span-2 text-right opacity-70">{formatCurrency(item.unitPrice)}</div>
                        <div className="col-span-1 text-center">
                            <span
                                className="px-2 py-1 rounded text-xs font-semibold text-white"
                                style={{ backgroundColor: template.secondaryColor }}
                            >
                                {item.vatRate}%
                            </span>
                        </div>
                        <div className="col-span-2 text-right font-bold">{formatCurrency(item.total)}</div>
                    </div>
                ))}
            </div>

            {/* Colorful Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-96">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${template.primaryColor}05` }}>
                            <span className="font-medium">Sous-total HT</span>
                            <span className="font-bold">{formatCurrency(data.subTotal)}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: `${template.secondaryColor}05` }}>
                            <span className="font-medium">TVA</span>
                            <span className="font-bold">{formatCurrency(data.taxAmount)}</span>
                        </div>
                    </div>
                    <div
                        className="flex justify-between p-4 rounded-xl text-white text-2xl font-bold"
                        style={{
                            background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`
                        }}
                    >
                        <span>Total TTC</span>
                        <span>{formatCurrency(data.total)}</span>
                    </div>
                </div>
            </div>

            {/* Colorful Footer */}
            <div
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: `${template.primaryColor}05` }}
            >
                <div className="flex justify-center gap-8 text-sm mb-3">
                    <span className="font-semibold">SIRET: {data.company.siret}</span>
                    <span>•</span>
                    <span>{data.company.email}</span>
                    <span>•</span>
                    <span>{data.company.phone}</span>
                </div>
                <p className="text-xs opacity-60">
                    Paiement à 30 jours • Pénalités de retard : 3 fois le taux d'intérêt légal
                </p>
            </div>
        </div>
    )
}
