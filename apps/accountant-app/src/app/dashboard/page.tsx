"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, CheckCircle2, TrendingUp, AlertCircle, Search, ExternalLink, ArrowUpRight, ArrowDownRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import { toast } from "sonner";

type CockpitData = {
    id: string;
    name: string;
    siret: string;
    plan: string;
    isActive: boolean;
    financials: {
        bankBalance: number;
        cashFlowTrend: 'stable' | 'up' | 'down';
    };
    todo: {
        missingReceipts: number;
        pendingValidation: number;
        unreconciledBank: number | string;
        overdueInvoices: number;
    };
    compliance: {
        tvaStatus: string;
        tvaNextDue: string;
        fecStatus: string;
    };
};

export default function DashboardPage() {
    const [clients, setClients] = useState<CockpitData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/accountant/companies/dashboard/stats');
            setClients(res.data);
        } catch (e) {
            console.error("Failed to fetch cockpit stats", e);
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = async (companyId: string) => {
        try {
            const token = localStorage.getItem('accountant_token');
            console.log('[Impersonate] Token:', token ? 'Present' : 'Missing');
            console.log('[Impersonate] CompanyId:', companyId);

            const response = await fetch(`http://localhost:3001/accountant/companies/${companyId}/impersonate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('[Impersonate] Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[Impersonate] Success! Redirecting to:', data.redirectUrl);
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                const errorText = await response.text();
                console.error('[Impersonate] Failed:', response.status, errorText);
                alert("Impossible d'accéder au dossier client.");
            }
        } catch (e) {
            console.error("Impersonation failed", e);
            alert("Impossible d'accéder au dossier client.");
        }
    }

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // KPI Calculations
    const totalClients = clients.length;
    const totalPending = clients.reduce((acc, c) => acc + c.todo.pendingValidation, 0);
    const criticalIssues = clients.filter(c => c.todo.missingReceipts > 0 || c.todo.overdueInvoices > 0).length;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Cockpit Expert</h2>
                    <p className="text-slate-500">Vue d'ensemble de votre portefeuille et priorités du jour.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Rapports</Button>
                    <Button><Briefcase className="mr-2 h-4 w-4" /> Nouveau Dossier</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-blue-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Portefeuille</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClients}</div>
                        <p className="text-xs text-slate-500">Dossiers actifs</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-orange-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">À Traiter</CardTitle>
                        <FileText className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPending}</div>
                        <p className="text-xs text-slate-500">Pièces en attente de validation</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Attention Requise</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{criticalIssues}</div>
                        <p className="text-xs text-slate-500">Dossiers avec bloquants (Reçus manquants, etc.)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Cockpit Table */}
            <Card className="col-span-1 shadow-md border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50">
                    <div className="space-y-1">
                        <CardTitle>Super-Vue Dossiers</CardTitle>
                        <CardDescription>Suivi en temps réel de la santé financière et administrative.</CardDescription>
                    </div>
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Filtrer par nom, SIRET..."
                            className="pl-8 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-none border-t">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4 w-[25%]">Client / Entité</th>
                                    <th className="p-4 w-[20%]">Météo (Tréso)</th>
                                    <th className="p-4 w-[30%]">To-Do (Actions)</th>
                                    <th className="p-4 w-[15%]">Compliance</th>
                                    <th className="p-4 w-[10%] text-right">Accès</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center">Chargement du cockpit...</td></tr>
                                ) : filteredClients.map(client => (
                                    <tr key={client.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-base">{client.name}</span>
                                                <span className="text-xs text-slate-500 font-mono mt-0.5">SIRET: {client.siret || 'N/A'}</span>
                                                <Badge variant="secondary" className="w-fit mt-1 text-[10px] h-5 bg-slate-100 text-slate-600 border-slate-200">
                                                    {client.plan || 'STANDARD'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${client.financials.bankBalance >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                                        {client.financials.bankBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                    </span>
                                                    {client.financials.cashFlowTrend === 'up' && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                                                    {client.financials.cashFlowTrend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                                                </div>
                                                <span className="text-[10px] text-slate-400">Solde bancaire J-1</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {client.todo.missingReceipts > 0 && (
                                                    <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 cursor-pointer">
                                                        <AlertCircle className="w-3 h-3 mr-1" /> {client.todo.missingReceipts} Justif. manquant
                                                    </Badge>
                                                )}
                                                {client.todo.pendingValidation > 0 && (
                                                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200 cursor-pointer">
                                                        <FileText className="w-3 h-3 mr-1" /> {client.todo.pendingValidation} à valider
                                                    </Badge>
                                                )}
                                                {Number(client.todo.unreconciledBank) > 0 && (
                                                    <Badge variant="outline" className="text-slate-600 border-dashed border-slate-300">
                                                        {client.todo.unreconciledBank} Banques non lettrées
                                                    </Badge>
                                                )}
                                                {client.todo.missingReceipts === 0 && client.todo.pendingValidation === 0 && (
                                                    <span className="text-xs text-green-600 flex items-center font-medium">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> À jour
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col text-xs space-y-1">
                                                <div className="flex justify-between w-full max-w-[120px]">
                                                    <span className="text-slate-500">TVA:</span>
                                                    <span className="font-semibold text-slate-700">{client.compliance.tvaStatus}</span>
                                                </div>
                                                <div className="flex justify-between w-full max-w-[120px]">
                                                    <span className="text-slate-500">FEC:</span>
                                                    <span className="text-green-600 font-semibold">{client.compliance.fecStatus}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-105"
                                                onClick={() => handleImpersonate(client.id)}
                                            >
                                                Accéder <ExternalLink className="ml-1 w-3 h-3" />
                                            </Button>
                                            <div className="mt-1">
                                                <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-slate-400" onClick={() => window.location.href = `/dashboard/companies/${client.id}`}>
                                                    Voir dossier
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

