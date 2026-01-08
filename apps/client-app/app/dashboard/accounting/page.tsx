"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportService } from "@/services/export.service"
import { accountingService, AccountingStats } from "@/services/accounting.service"
import { Download, FileSpreadsheet, RefreshCw, Briefcase, UserCheck, Phone, ArrowUpRight } from "lucide-react"
import { RevenueChart } from "@/components/accounting/revenue-chart"
import { VatSummary } from "@/components/accounting/vat-summary"
import { JournalTable } from "@/components/accounting/journal-table"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/providers/toast-provider"
import { ServiceRequestModal } from "@/components/accounting/service-request-modal"

export default function AccountingPage() {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString())
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<AccountingStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [openHireModal, setOpenHireModal] = useState(false)
    const [openConsultModal, setOpenConsultModal] = useState(false)
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

    const availableYears = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

    return (
        <div className="space-y-8 pb-32 md:pb-20 text-white max-w-7xl mx-auto p-4">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight text-white">Comptabilité & Reporting</h1>
                    <p className="text-zinc-400 mt-1">Gérez vos finances et collaborez avec vos experts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-brand-dark border-white/10 text-white">
                            {availableYears.map((y) => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={loadStats} disabled={loadingStats} className="bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">
                        <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Accountant Services Banner */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-brand-gold/20 to-brand-dark border-brand-gold/30 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-gold/5 group-hover:bg-brand-gold/10 transition-colors" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-brand-gold">
                            <UserCheck className="h-5 w-5" />
                            Besoin d'un Expert-Comptable ?
                        </CardTitle>
                        <CardDescription className="text-zinc-300">
                            Déléguez votre comptabilité à un expert dédié certifié.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => setOpenHireModal(true)} className="w-full bg-brand-gold text-brand-dark hover:bg-yellow-500 font-bold border-0 shadow-lg shadow-brand-gold/20">
                            Recruter un Expert <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-white/5 border-white/10 shadow-lg relative overflow-hidden hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Phone className="h-5 w-5 text-blue-400" />
                            Une question fiscale ?
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Réservez une consultation de 30 min avec un conseiller.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => setOpenConsultModal(true)} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40">
                            Réserver une consultation
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <ServiceRequestModal
                type="HIRE_ACCOUNTANT"
                open={openHireModal}
                onOpenChange={setOpenHireModal}
            />
            <ServiceRequestModal
                type="CONSULTATION"
                open={openConsultModal}
                onOpenChange={setOpenConsultModal}
            />

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Chiffre d'Affaires (HT)</CardTitle>
                        <Briefcase className="h-4 w-4 text-brand-gold" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats ? formatCurrency(stats.totalRevenue) : "..."}</div>
                        <p className="text-xs text-zinc-500">Année {year}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">TVA Collectée</CardTitle>
                        <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats ? formatCurrency(stats.totalVat) : "..."}</div>
                        <p className="text-xs text-zinc-500">À déclarer</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 shadow-sm opacity-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Résultat Net (Est.)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">-- €</div>
                        <p className="text-xs text-zinc-500">Données insuffisantes</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 shadow-sm opacity-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Trésorerie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">-- €</div>
                        <p className="text-xs text-zinc-500">Synchronisation requise</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <RevenueChart data={stats?.monthlyStats || []} />
                </div>
                <div className="md:col-span-1">
                    <VatSummary data={stats?.monthlyStats || []} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-1 bg-white/5 border-white/10 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Download className="h-5 w-5 text-zinc-400" />
                            Exports Fiscaux (FEC)
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Fichier des Écritures Comptables obligatoire.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={handleDownloadFEC} disabled={loading}>
                            {loading ? "Génération..." : (
                                <>
                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Télécharger FEC ({year})
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-zinc-500 mt-4 text-center">
                            Conforme à l'article A47 A-1 du LPF.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Journal des Opérations</h2>
                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <JournalTable />
                </div>
            </div>
        </div>
    )
}
