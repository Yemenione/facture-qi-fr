"use client"

import { useState, useEffect } from "react"
import statsService, { DashboardStats } from "@/services/stats.service"
import { formatCurrency } from "@/lib/utils"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import {
    TrendingUp,
    Users,
    FileText,
    CreditCard,
    Plus,
    ArrowUpRight,
    MoreHorizontal,
    Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { motion } from "framer-motion"

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await statsService.getDashboardStats()
            setStats(data)
        } catch (error) {
            console.error("Failed to load stats", error)
        } finally {
            setLoading(false)
        }
    }

    const SkeletonCard = () => (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 animate-pulse" />
    )

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    const chartData = [
        { name: 'Lun', val: 400 },
        { name: 'Mar', val: 300 },
        { name: 'Mer', val: 600 },
        { name: 'Jeu', val: 800 },
        { name: 'Ven', val: 500 },
        { name: 'Sam', val: 900 },
        { name: 'Dim', val: 700 },
    ]

    return (
        <div className="space-y-8 p-2 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Vue d'ensemble
                    </h1>
                    <p className="text-slate-500 mt-1">Vos performances financières en temps réel.</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild className="bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 rounded-full px-6">
                        <Link href="/dashboard/invoices/new">
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
                        </Link>
                    </Button>
                </div>
            </div>

            <BentoGrid className="max-w-full md:auto-rows-[20rem]">
                {/* 1. Main Revenue Card (Large) */}
                <BentoGridItem
                    title="Chiffre d'Affaires Total"
                    description="Revenus encaissés sur la période."
                    className="md:col-span-2 bg-white border-slate-100 shadow-sm"
                    header={
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-green-50 rounded-2xl">
                                    <Wallet className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5%
                                </span>
                            </div>
                            <div>
                                <h2 className="text-5xl font-bold text-slate-900 tracking-tight mt-4">
                                    {formatCurrency(stats?.totalRevenue || 0)}
                                </h2>
                                <div className="h-32 mt-4 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ fill: '#f1f5f9' }}
                                            />
                                            <Bar dataKey="val" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    }
                />

                {/* 2. Pending Revenue (Medium) */}
                <BentoGridItem
                    title="En Attente"
                    description="Montant non encore encaissé."
                    className="md:col-span-1 bg-gradient-to-br from-orange-50 to-white border-none shadow-sm"
                    header={
                        <div className="flex flex-col h-full justify-center items-center">
                            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                <TrendingUp className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-800">
                                {formatCurrency(stats?.pendingRevenue || 0)}
                            </div>
                            <div className="text-sm text-orange-600 mt-2 font-medium">Attention requise</div>
                        </div>
                    }
                />

                {/* 3. Clients & Growth (Medium) */}
                <BentoGridItem
                    title="Clients Actifs"
                    description="Base client en croissance."
                    className="bg-white shadow-sm border-slate-100"
                    header={
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="w-6 h-6 text-slate-400" />
                                <MoreHorizontal className="w-5 h-5 text-slate-300" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">
                                {stats?.clientsCount || 0}
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <div className="flex -space-x-2 mt-6 overflow-hidden">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                        C{i}
                                    </div>
                                ))}
                                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                                    +
                                </div>
                            </div>
                        </div>
                    }
                />

                {/* 4. Recent Documents (Large List) */}
                <BentoGridItem
                    title="Factures Récentes"
                    description="Historique des derniers mouvements."
                    className="md:col-span-2 bg-white border-slate-100 shadow-sm"
                    header={
                        <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2">
                            {stats?.recentInvoices?.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    Aucune facture récente
                                </div>
                            ) : (
                                stats?.recentInvoices?.slice(0, 4).map((invoice: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{invoice.client?.name}</div>
                                                <div className="text-xs text-slate-500">{invoice.invoiceNumber} • {new Date(invoice.issueDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">{formatCurrency(invoice.total)}</div>
                                            <div className="text-xs text-green-600 font-medium">Envoyé</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    }
                />
            </BentoGrid>
        </div>
    )
}
