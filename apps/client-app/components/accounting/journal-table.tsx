"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useEffect, useState } from "react"
import { accountingService } from "@/services/accounting.service"
import { Loader2 } from "lucide-react"

export function JournalTable() {
    const [entries, setEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadJournal()
    }, [])

    const loadJournal = async () => {
        try {
            const data = await accountingService.getJournal(50) // Limit to 50 for now
            setEntries(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <Card className="col-span-full bg-white/5 border-white/10 shadow-sm">
            <CardHeader>
                <CardTitle className="text-zinc-200">Journal des Ventes (Dernières écritures)</CardTitle>
                <CardDescription className="text-zinc-400">Vue comptable des factures validées et avoirs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400">Numéro</TableHead>
                            <TableHead className="text-zinc-400">Client</TableHead>
                            <TableHead className="text-zinc-400">Type</TableHead>
                            <TableHead className="text-right text-zinc-400">HT (706)</TableHead>
                            <TableHead className="text-right text-zinc-400">TVA (4457)</TableHead>
                            <TableHead className="text-right text-zinc-400">TTC (411)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="text-zinc-300">{new Date(entry.issueDate).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium text-white">{entry.invoiceNumber}</TableCell>
                                <TableCell className="text-zinc-300">{entry.client.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={entry.type === 'CREDIT_NOTE'
                                        ? 'border-red-900/50 bg-red-900/20 text-red-400'
                                        : 'border-brand-gold/50 bg-brand-gold/10 text-brand-gold'}>
                                        {entry.type === 'CREDIT_NOTE' ? 'AVOIR' : 'FACTURE'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-zinc-300">{formatCurrency(entry.subTotal)}</TableCell>
                                <TableCell className="text-right text-zinc-500">{formatCurrency(entry.taxAmount)}</TableCell>
                                <TableCell className="text-right font-bold text-white">{formatCurrency(entry.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
