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
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Journal des Ventes (Dernières écritures)</CardTitle>
                <CardDescription>Vue comptable des factures validées et avoirs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">HT (706)</TableHead>
                            <TableHead className="text-right">TVA (4457)</TableHead>
                            <TableHead className="text-right">TTC (411)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.issueDate).toLocaleDateString()}</TableCell>
                                <TableCell className="font-medium">{entry.invoiceNumber}</TableCell>
                                <TableCell>{entry.client.name}</TableCell>
                                <TableCell>
                                    <Badge variant={entry.type === 'CREDIT_NOTE' ? 'destructive' : 'default'}>
                                        {entry.type === 'CREDIT_NOTE' ? 'AVOIR' : 'FACTURE'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(entry.subTotal)}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{formatCurrency(entry.taxAmount)}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(entry.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
