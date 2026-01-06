"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface VatSummaryProps {
    data: any[]
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function VatSummary({ data }: VatSummaryProps) {
    // Filter out months with 0 activity to keep it clean, or keep all? Users usually prefer seeing only active months for VAT declarations.
    // Let's keep recent/active months or all if needed. For now, all.

    const activeData = data.filter(d => d.revenue > 0 || d.vat > 0);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Synthèse TVA</CardTitle>
                <CardDescription>TVA collectée par mois (CA3).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activeData.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-8">Aucune donnée pour cette période.</p>
                    ) : (
                        <div className="space-y-2">
                            {activeData.map((d) => (
                                <div key={d.month} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                                    <span className="font-medium text-slate-700">{MONTHS[d.month - 1]}</span>
                                    <div className="text-right">
                                        <div className="font-bold">{formatCurrency(d.vat)}</div>
                                        <div className="text-xs text-muted-foreground">Base HT: {formatCurrency(d.revenue)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
