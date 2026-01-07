"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileText, Download, TrendingUp, PieChart,
    BarChart3, Calendar, Filter
} from "lucide-react";
import { toast } from "sonner";

type Report = {
    id: string;
    name: string;
    description: string;
    type: string;
    icon: any;
    color: string;
};

export default function ReportsPage() {
    const reports: Report[] = [
        {
            id: "1",
            name: "Bilan consolidé",
            description: "Vue d'ensemble de tous vos clients",
            type: "Synthèse",
            icon: PieChart,
            color: "blue"
        },
        {
            id: "2",
            name: "Activité mensuelle",
            description: "Rapport d'activité du mois en cours",
            type: "Mensuel",
            icon: BarChart3,
            color: "green"
        },
        {
            id: "3",
            name: "Échéances TVA",
            description: "Liste des prochaines échéances TVA",
            type: "Fiscal",
            icon: Calendar,
            color: "orange"
        },
        {
            id: "4",
            name: "Performance cabinet",
            description: "KPIs et métriques de performance",
            type: "Analytique",
            icon: TrendingUp,
            color: "purple"
        }
    ];

    const handleGenerate = (report: Report) => {
        toast.success(`Génération du rapport "${report.name}" en cours...`);
    };

    const handleDownload = (report: Report) => {
        toast.success(`Téléchargement de "${report.name}"`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
                    <p className="text-slate-500 mt-2">
                        Générez des rapports détaillés pour votre cabinet
                    </p>
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Clients actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">7</div>
                        <p className="text-xs text-slate-500 mt-1">
                            +2 ce mois
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Documents traités
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">342</div>
                        <p className="text-xs text-slate-500 mt-1">
                            ce mois
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Temps gagné
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">24h</div>
                        <p className="text-xs text-slate-500 mt-1">
                            via automation
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Taux validation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">94%</div>
                        <p className="text-xs text-slate-500 mt-1">
                            +5% vs mois dernier
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Reports Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {reports.map((report) => {
                    const Icon = report.icon;
                    const colorClasses = {
                        blue: 'bg-blue-100 text-blue-600',
                        green: 'bg-green-100 text-green-600',
                        orange: 'bg-orange-100 text-orange-600',
                        purple: 'bg-purple-100 text-purple-600'
                    };

                    return (
                        <Card key={report.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg ${colorClasses[report.color as keyof typeof colorClasses]}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{report.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {report.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{report.type}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleGenerate(report)}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Générer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDownload(report)}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Reports */}
            <Card>
                <CardHeader>
                    <CardTitle>Rapports récents</CardTitle>
                    <CardDescription>
                        Vos derniers rapports générés
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { name: "Bilan consolidé - Janvier 2026", date: "2026-01-05", size: "2.4 MB" },
                            { name: "Activité mensuelle - Décembre 2025", date: "2026-01-02", size: "1.8 MB" },
                            { name: "Performance cabinet - Q4 2025", date: "2025-12-28", size: "3.1 MB" }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {new Date(item.date).toLocaleDateString('fr-FR')} • {item.size}
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
