"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { dunningService, OverdueInvoice } from "@/services/dunning.service"
import { useToast } from "@/providers/toast-provider"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Send, MailWarning, Clock, AlertCircle } from "lucide-react"

export default function DunningPage() {
    const [invoices, setInvoices] = useState<OverdueInvoice[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const toast = useToast()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await dunningService.getOverdue()
            setInvoices(data)
        } catch (error) {
            console.error(error)
            toast.error("Erreur de chargement", "Impossible de récupérer les factures en retard.")
        } finally {
            setLoading(false)
        }
    }

    const handleRemind = async (invoice: OverdueInvoice) => {
        setActionLoading(invoice.id)
        try {
            await dunningService.remind(invoice.id)
            toast.success("Relance envoyée", `Une relance "${getReminderLabel(invoice.reminderLevel + 1)}" a été envoyée par email à ${invoice.client.email}.`)
            // Refresh list
            loadData()
        } catch (error) {
            console.error(error)
            toast.error("Échec de l'envoi", "La relance n'a pas pu être envoyée.")
        } finally {
            setActionLoading(null)
        }
    }

    const getReminderLabel = (level: number) => {
        switch (level) {
            case 0: return "Première relance"
            case 1: return "Relance Niv. 1 (Amiable)"
            case 2: return "Relance Niv. 2 (Ferme)"
            case 3: return "Mise en demeure"
            default: return "Contentieux"
        }
    }

    const getReminderColor = (level: number) => {
        switch (level) {
            case 0: return "bg-blue-100 text-blue-800 border-blue-200"
            case 1: return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case 2: return "bg-orange-100 text-orange-800 border-orange-200"
            case 3: return "bg-red-100 text-red-800 border-red-200"
            default: return "bg-slate-100 text-slate-800"
        }
    }

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <MailWarning className="h-8 w-8 text-orange-600" />
                    Relances & Recouvrement
                </h1>
                <p className="text-slate-500">
                    Gérez les factures impayées et envoyez des rappels automatiques à vos clients.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-800">Total en retard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-900">
                            {formatCurrency(invoices.reduce((acc, inv) => acc + inv.total, 0))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Factures concernées</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{invoices.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Factures à relancer</CardTitle>
                    <CardDescription>Liste des factures dont la date d'échéance est dépassée.</CardDescription>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                            <Clock className="h-10 w-10 mb-3 text-slate-300" />
                            <p>Aucune facture en retard ! Tout est à jour. 🎉</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Facture</TableHead>
                                    <TableHead>Échéance</TableHead>
                                    <TableHead className="text-right">Reste à payer</TableHead>
                                    <TableHead className="text-center">Niveau actuel</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => {
                                    const daysLate = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 3600 * 24))
                                    return (
                                        <TableRow key={invoice.id}>
                                            <TableCell>
                                                <div className="font-medium">{invoice.client.name}</div>
                                                <div className="text-xs text-muted-foreground">{invoice.client.email}</div>
                                            </TableCell>
                                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-red-600 font-medium">
                                                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                                                    <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full">J+{daysLate}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-900">
                                                {formatCurrency(invoice.total)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={getReminderColor(invoice.reminderLevel)}>
                                                    {getReminderLabel(invoice.reminderLevel)}
                                                </Badge>
                                                {invoice.lastReminderDate && (
                                                    <div className="text-[10px] text-muted-foreground mt-1">
                                                        Dernière: {new Date(invoice.lastReminderDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleRemind(invoice)}
                                                    disabled={!!actionLoading}
                                                    className={invoice.reminderLevel >= 3 ? "bg-red-600 hover:bg-red-700" : ""}
                                                >
                                                    {actionLoading === invoice.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 h-3 w-3" />
                                                            {invoice.reminderLevel >= 3 ? "Contentieux" : "Relancer"}
                                                        </>
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
