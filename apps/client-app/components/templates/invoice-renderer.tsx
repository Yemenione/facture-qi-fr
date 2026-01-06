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
            <div className={`mb-8 ${headerStyle === 'BANNER' ? '-mx-12 -mt-12 p-12 text-white' : ''}`}
                style={headerStyle === 'BANNER' ? { backgroundColor: styles.primaryColor } : {}}
            >
                <div className={`flex items-start justify-between ${logoPosition === 'CENTER' ? 'flex-col items-center text-center' : ''} ${logoPosition === 'RIGHT' ? 'flex-row-reverse' : ''}`}>
                    {/* Company Logo / Name */}
                    <div className="space-y-2">
                        {template.logoUrl ? (
                            <img src={template.logoUrl} alt="Logo" style={{ width: template.logoWidth || 100 }} />
                        ) : (
                            <h1 className="text-2xl font-bold uppercase tracking-wider">{data.companyName}</h1>
                        )}
                        {headerStyle !== 'MINIMAL' && (
                            <div className={`text-xs opacity-80 ${headerStyle === 'BANNER' ? 'text-white' : 'text-gray-500'}`}>
                                <p>{data.companyAddress}</p>
                                <p>{data.companyEmail}</p>
                                <p>{data.companyPhone}</p>
                            </div>
                        )}
                    </div>

                    {/* Invoice Meta */}
                    <div className={`${logoPosition === 'CENTER' ? 'mt-6' : 'text-right'}`}>
                        <h2 className="text-3xl font-light mb-1 uppercase" style={headerStyle !== 'BANNER' ? { color: styles.primaryColor } : {}}>{data.documentTitle || 'FACTURE'}</h2>
                        <p className="text-lg font-medium">#{data.invoiceNumber}</p>
                        <p className="text-xs opacity-70 mt-1">Date: {data.issueDate}</p>
                        <p className="text-xs opacity-70">Échéance: {data.dueDate}</p>
                    </div>
                </div>
            </div>

            {/* Client Section */}
            <div className="flex justify-between mb-12">
                <div className="w-1/2">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ borderColor: styles.secondaryColor, color: styles.secondaryColor }}>
                        Facturer à
                    </h3>
                    <p className="font-bold text-lg">{data.clientName}</p>
                    <p className="opacity-80">{data.clientAddress}</p>
                    <p className="opacity-80">{data.clientEmail}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr style={{ backgroundColor: headerStyle !== 'BANNER' ? styles.secondaryColor + '20' : 'transparent', borderBottom: `2px solid ${styles.primaryColor}` }}>
                        <th className="text-left py-3 px-2 font-bold" style={{ color: styles.primaryColor }}>Description</th>
                        <th className="text-right py-3 px-2 font-bold" style={{ color: styles.primaryColor }}>Qté</th>
                        <th className="text-right py-3 px-2 font-bold" style={{ color: styles.primaryColor }}>Prix Unit.</th>
                        <th className="text-right py-3 px-2 font-bold" style={{ color: styles.primaryColor }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item: any, index: number) => (
                        <tr key={index} className="border-b" style={{ borderColor: styles.secondaryColor + '40' }}>
                            <td className="py-3 px-2">{item.description}</td>
                            <td className="py-3 px-2 text-right">{item.quantity}</td>
                            <td className="py-3 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-3 px-2 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer / Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 md:w-1/3 space-y-2">
                    <div className="flex justify-between py-1 border-b" style={{ borderColor: styles.secondaryColor + '40' }}>
                        <span>Sous-total</span>
                        <span>{formatCurrency(data.subTotal)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b" style={{ borderColor: styles.secondaryColor + '40' }}>
                        <span>TVA (20%)</span>
                        <span>{formatCurrency(data.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between py-3 font-bold text-xl" style={{ color: styles.primaryColor }}>
                        <span>Total TTC</span>
                        <span>{formatCurrency(data.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Mentions */}
            <div className="absolute bottom-12 left-12 right-12 text-center text-xs opacity-60">
                {template.paymentTermsText && <p className="mb-2 font-semibold">{template.paymentTermsText}</p>}
                {template.legalMentions && <p className="mb-2">{template.legalMentions}</p>}
                {template.footerText && <p>{template.footerText}</p>}
            </div>
        </div>
    )
}
