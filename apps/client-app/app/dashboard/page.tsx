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
    Wallet,
    Loader2,
    Calendar,
    ChevronRight,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth-store"

export default function DashboardPage() {
    const { user } = useAuthStore()
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

    // Mock data for the chart - In a real app eventually this would come from the backend
    const chartData = [
        { name: 'Lun', val: 1200 },
        { name: 'Mar', val: 2100 },
        { name: 'Mer', val: 1800 },
        { name: 'Jeu', val: 2400 },
        { name: 'Ven', val: 3200 },
        { name: 'Sam', val: 2800 },
        { name: 'Dim', val: 3800 },
    ]

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bonjour"
        if (hour < 18) return "Bonne après-midi"
        return "Bonsoir"
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
                    <p className="text-sm text-zinc-400">Chargement de votre tableau de bord...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 p-2 pb-20 max-w-7xl mx-auto text-white">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-white">
                        {getGreeting()}, {user?.firstName || 'Entrepreneur'} 👋
                    </h1>
                    <p className="text-zinc-400 mt-1">Voici ce qui se passe dans votre entreprise aujourd'hui.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="hidden md:flex border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </Button>
                    <Button asChild className="bg-brand-gold hover:bg-yellow-500 text-brand-dark shadow-lg shadow-brand-gold/20 rounded-full px-6 transition-all hover:scale-105 font-bold">
                        <Link href="/dashboard/invoices/new">
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
                        </Link>
                    </Button>
                </div>
            </motion.div>

            <BentoGrid className="max-w-full md:auto-rows-[22rem]">
                {/* 1. Main Revenue Card (Large) */}
                <BentoGridItem
                    className="md:col-span-2 bg-gradient-to-br from-brand-blue/10 to-brand-dark border-white/10 shadow-sm"
                    header={
                        <div className="flex flex-col h-full justify-between p-2">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/5 rounded-2xl shadow-sm border border-white/10">
                                    <Wallet className="w-6 h-6 text-brand-gold" />
                                </div>
                                <span className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5%
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-zinc-400">Chiffre d'Affaires</p>
                                <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white tracking-tight mt-1">
                                    {formatCurrency(stats?.totalRevenue || 0)}
                                </h2>
                            </div>
                            <div className="flex-1 min-h-[160px] w-full mt-4 -mx-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e1b4b',
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                            itemStyle={{ color: '#D4AF37' }}
                                            formatter={(value: number) => [`${value} €`, 'Revenus']}
                                            cursor={{ stroke: '#ffffff30', strokeDasharray: '4 4' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="val"
                                            stroke="#D4AF37"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorVal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    }
                />

                {/* 2. Quick Stats Column */}
                <div className="row-span-1 md:row-span-1 md:col-span-1 grid grid-rows-2 gap-4">
                    {/* Pending Revenue */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-orange-500/10 rounded-lg shadow-sm text-orange-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">En Attente</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                {formatCurrency(stats?.pendingRevenue || 0)}
                            </h3>
                        </div>
                    </motion.div>

                    {/* Clients Count */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-blue-500/10 rounded-lg shadow-sm text-brand-blue">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Clients Actifs</p>
                            <h3 className="text-2xl font-bold text-white mt-1">
                                {stats?.clientsCount || 0}
                            </h3>
                        </div>
                    </motion.div>
                </div>

                {/* 3. Recent Invoices (Large List) */}
                <BentoGridItem
                    className="md:col-span-3 bg-white/5 border-white/10 shadow-sm"
                    header={
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Activity className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <h3 className="font-semibold text-white">Activité Récente</h3>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="text-zinc-400 hover:text-white hover:bg-white/5">
                                    <Link href="/dashboard/invoices">
                                        Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2 overflow-y-auto pr-2 max-h-[300px]">
                                {stats?.recentInvoices?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-zinc-500 border-2 border-dashed border-white/10 rounded-lg">
                                        <FileText className="w-8 h-8 mb-2 opacity-50" />
                                        <p>Aucune facture récente</p>
                                    </div>
                                ) : (
                                    stats?.recentInvoices?.slice(0, 5).map((invoice: any, idx: number) => {
                                        const isPaid = invoice.status === 'PAID'
                                        const isPending = invoice.status === 'SENT' || invoice.status === 'VALIDATED'

                                        return (
                                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPaid ? 'bg-emerald-500/10 text-emerald-500' :
                                                        isPending ? 'bg-orange-500/10 text-orange-500' : 'bg-white/10 text-zinc-400'
                                                        }`}>
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{invoice.client?.name || 'Client Inconnu'}</div>
                                                        <div className="text-xs text-zinc-500 flex items-center gap-2">
                                                            {invoice.invoiceNumber}
                                                            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                                            {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-white">{formatCurrency(invoice.total)}</div>
                                                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${isPaid ? 'bg-emerald-500/10 text-emerald-500' :
                                                        isPending ? 'bg-orange-500/10 text-orange-500' : 'bg-white/10 text-zinc-400'
                                                        }`}>
                                                        {isPaid ? 'Payée' : isPending ? 'En attente' : invoice.status}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    }
                />
            </BentoGrid>
        </div>
    )
}
