"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportService } from "@/services/export.service"
import { accountingService, AccountingStats } from "@/services/accounting.service"
import { Download, FileSpreadsheet, RefreshCw } from "lucide-react"
import { RevenueChart } from "@/components/accounting/revenue-chart"
import { VatSummary } from "@/components/accounting/vat-summary"
import { JournalTable } from "@/components/accounting/journal-table"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/providers/toast-provider"

export default function AccountingPage() {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString())
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<AccountingStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const toast = useToast()

    useEffect(() => {
        loadStats();
    }, [year])

    const loadStats = async () => {
        setLoadingStats(true);
        try {
            const data = await accountingService.getStats(parseInt(year));
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats", error);
            // Optional: toast.error("Erreur de chargement des stats")
        } finally {
            setLoadingStats(false);
        }
    }

    const handleDownloadFEC = async () => {
        setLoading(true)
        try {
            const blob = await exportService.downloadFec(parseInt(year))
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FEC-${year}.txt`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("FEC généré avec succès", "Le fichier a été téléchargé.");
        } catch (error) {
            console.error("Failed to download FEC", error)
            toast.error("Erreur de téléchargement", "Impossible de générer le FEC pour l'instant.");
        } finally {
            setLoading(false)
        }
    }
    // ... rest of component

    const availableYears = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Comptabilité & Reporting</h1>
                <div className="flex items-center gap-4">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map((y) => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={loadStats} disabled={loadingStats}>
                        <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chiffre d'Affaires (HT)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats ? formatCurrency(stats.totalRevenue) : "..."}</div>
                        <p className="text-xs text-muted-foreground">Année {year}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TVA Collectée</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats ? formatCurrency(stats.totalVat) : "..."}</div>
                        <p className="text-xs text-muted-foreground">À déclarer</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {stats && <RevenueChart data={stats.monthlyStats} />}
                {stats && <VatSummary data={stats.monthlyStats} />}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5" />
                            Exports Comptables
                        </CardTitle>
                        <CardDescription>
                            Générez les fichiers obligatoires pour l'administration fiscale.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={handleDownloadFEC} disabled={loading}>
                            {loading ? "Génération..." : (
                                <>
                                    <Download className="mr-2 h-4 w-4" /> Télécharger FEC ({year})
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            Conforme à l'article A47 A-1 du LPF.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <JournalTable />
            </div>
        </div>
    )
}
