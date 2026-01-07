import { formatCurrency } from "@/lib/utils"

export default function InvoiceRenderer({ template, data }: { template: any, data: any }) {
    if (!template) return null;

    // Apply styles based on template config
    const styles = {
        fontFamily: template.fontFamily || 'Inter',
        primaryColor: template.primaryColor || '#000000',
        secondaryColor: template.secondaryColor || '#666666',
        backgroundColor: template.backgroundColor || '#ffffff',
        textColor: template.textColor || '#000000',
    }

    // Dynamic classes based on Layout
    const headerStyle = template.headerStyle || 'DETAILED'; // MINIMAL, DETAILED, BANNER
    const logoPosition = template.logoPosition || 'LEFT'; // LEFT, CENTER, RIGHT

    return (
        <div
            className="w-full min-h-[29.7cm] bg-white shadow-lg p-8 md:p-12 text-sm relative print:shadow-none print:p-0 print:m-0 print:w-full print:h-auto print:text-black print:overflow-visible"
            style={{
                fontFamily: styles.fontFamily,
                color: styles.textColor,
                backgroundColor: styles.backgroundColor,
                WebkitPrintColorAdjust: 'exact', // Force print colors in React style
                printColorAdjust: 'exact'
            }}
        >
            {/* Header Section */}
            <div className={`mb-12 ${headerStyle === 'BANNER' ? '-mx-12 -mt-12 p-12 text-white shadow-md' : ''}`}
                style={headerStyle === 'BANNER' ? { backgroundColor: styles.primaryColor } : {}}
            >
                <div className={`flex items-start justify-between ${logoPosition === 'CENTER' ? 'flex-col items-center text-center' : ''} ${logoPosition === 'RIGHT' ? 'flex-row-reverse' : ''}`}>

                    {/* Company Identity */}
                    <div className="space-y-3 max-w-[50%]">
                        {template.logoUrl ? (
                            <img src={template.logoUrl} alt="Logo" style={{ width: template.logoWidth || 150 }} className="object-contain" />
                        ) : (
                            <h1 className="text-3xl font-extrabold uppercase tracking-tight" style={headerStyle !== 'BANNER' ? { color: styles.primaryColor } : {}}>{data.companyName}</h1>
                        )}

                        {/* Company Contact Details */}
                        {headerStyle !== 'MINIMAL' && (
                            <div className={`text-sm space-y-1 ${headerStyle === 'BANNER' ? 'text-white/90' : 'text-gray-500'}`}>
                                <p className="font-medium">{data.companyAddress}</p>
                                <p>{data.companyEmail} • {data.companyPhone}</p>
                            </div>
                        )}
                    </div>

                    {/* Invoice Meta - Styled Block */}
                    <div className={`${logoPosition === 'CENTER' ? 'mt-8 w-full' : 'text-right min-w-[200px]'}`}>
                        <div className={`inline-block ${headerStyle !== 'BANNER' ? 'bg-slate-50 p-6 rounded-xl border border-slate-100' : ''}`}>
                            <h2 className="text-4xl font-light mb-4 uppercase tracking-wider"
                                style={headerStyle !== 'BANNER' ? { color: styles.primaryColor } : { color: 'white' }}>
                                {data.documentTitle || 'FACTURE'}
                            </h2>
                            <div className={`space-y-3 text-sm ${headerStyle === 'BANNER' ? 'text-white/90' : 'text-slate-600'}`}>
                                <div className="flex justify-between gap-8 border-b border-current/10 pb-2">
                                    <span className="font-semibold opacity-60 text-xs uppercase tracking-wider">N° Facture</span>
                                    <span className="font-bold font-mono text-base">{data.invoiceNumber}</span>
                                </div>
                                <div className="flex justify-between gap-8 border-b border-current/10 pb-2">
                                    <span className="font-semibold opacity-60 text-xs uppercase tracking-wider">Date</span>
                                    {/* Force DD/MM/YYYY format */}
                                    <span className="font-medium">
                                        {new Date(data.issueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </span>
                                </div>
                                {/* Only show Due Date if valid */}
                                {data.dueDate && data.dueDate !== 'Non spécifiée' && (
                                    <div className="flex justify-between gap-8 pt-1">
                                        <span className="font-semibold opacity-60 text-xs uppercase tracking-wider">Échéance</span>
                                        <span className="font-medium">
                                            {new Date(data.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Section - Styled with a connector line or box */}
            <div className="flex justify-end mb-16 relative">
                {/* Decorative line if Classic */}
                {headerStyle !== 'BANNER' && (
                    <div className="absolute left-0 top-4 w-1/3 h-px bg-slate-200"></div>
                )}

                <div className="w-1/2 md:w-5/12 bg-slate-50/50 p-6 rounded-lg border border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: styles.primaryColor }}>
                        Facturer à
                    </h3>
                    <div className="space-y-1 text-slate-800">
                        <p className="font-bold text-xl mb-2">{data.clientName}</p>
                        <p className="opacity-80 leading-relaxed">{data.clientAddress}</p>
                        <p className="opacity-80 text-sm mt-2">{data.clientEmail}</p>
                    </div>
                </div>
            </div>

            {/* Items Table - Clean & Spacious */}
            <table className="w-full mb-12">
                <thead>
                    <tr style={{ borderBottom: `2px solid ${styles.primaryColor}` }}>
                        <th className="text-left py-4 pl-4 font-bold uppercase text-xs tracking-wider" style={{ color: styles.primaryColor }}>Description</th>
                        <th className="text-right py-4 font-bold uppercase text-xs tracking-wider" style={{ color: styles.primaryColor }}>Qté</th>
                        <th className="text-right py-4 font-bold uppercase text-xs tracking-wider" style={{ color: styles.primaryColor }}>Prix Unit.</th>
                        <th className="text-right py-4 pr-4 font-bold uppercase text-xs tracking-wider" style={{ color: styles.primaryColor }}>Total HT</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {data.items.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 pl-4 font-medium">{item.description}</td>
                            <td className="py-4 text-right tabular-nums text-slate-500">{item.quantity}</td>
                            <td className="py-4 text-right tabular-nums text-slate-500">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-4 pr-4 text-right font-semibold tabular-nums">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer / Totals */}
            <div className="flex justify-end mb-16">
                <div className="w-1/2 md:w-5/12 space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
                        <span>Total Hors Taxes</span>
                        <span className="font-medium text-slate-900">{formatCurrency(data.subTotal)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
                        <span>TVA (20%)</span>
                        <span className="font-medium text-slate-900">{formatCurrency(data.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between py-4 px-4 rounded-lg mt-4 items-center shadow-sm" style={{ backgroundColor: styles.primaryColor, color: '#fff' }}>
                        <span className="font-bold uppercase tracking-wider text-sm">Net à payer</span>
                        <span className="font-bold text-2xl">{formatCurrency(data.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Mentions - Compliance */}
            <div className="absolute bottom-6 left-12 right-12 text-center text-xs text-slate-400 space-y-2">
                {/* Custom Payment Terms & Notes */}
                {(template.paymentTermsText || template.footerText) && (
                    <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-100 mx-auto max-w-2xl">
                        {template.paymentTermsText && <p className="font-semibold text-slate-700">{template.paymentTermsText}</p>}
                        {template.footerText && <p className="italic mt-1 text-slate-600">{template.footerText}</p>}
                        {/* Mandatory Late Fee Mention */}
                        <p className="text-[10px] mt-2 text-slate-400">
                            En cas de retard de paiement, application d'une indemnité forfaitaire pour frais de recouvrement de 40€ selon l'art. D. 441-5 du code de commerce.
                            Tout retard entraîne l'application de pénalités de retard au taux de 3 fois le taux d'intérêt légal.
                        </p>
                    </div>
                )}

                {/* Separator */}
                <div className="w-24 h-px bg-slate-200 mx-auto my-4"></div>

                {/* Auto-Synced Company Legal Info */}
                <div className="text-[10px] leading-relaxed">
                    <p className="font-medium text-slate-600">
                        {[
                            data.companyName,
                            data.companyLegalForm,
                            data.companyCapital ? `Capital de ${data.companyCapital} €` : '',
                            data.companySiret ? `SIREN ${data.companySiret}` : '',
                            data.companyRcs ? `RCS ${data.companyRcs}` : '',
                            data.companyVat ? `N° TVA ${data.companyVat}` : ''
                        ].filter(Boolean).join(' • ')}
                    </p>
                    {data.companyIban && (
                        <p className="mt-1 font-mono bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">
                            IBAN: {data.companyIban} {data.companyBic ? `• BIC: ${data.companyBic}` : ''}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
