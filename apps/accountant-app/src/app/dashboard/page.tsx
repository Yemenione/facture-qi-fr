"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, CheckCircle2, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    // In a real scenario, these stats would come from the aggregation endpoint
    const stats = {
        totalClients: 12,
        documentsPending: 45,
        monthlyRevenue: "15,400€", // Revenue of the firm
        portofolioRisk: "Low"
    };

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-t-4 border-blue-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                            <span className="text-green-600 font-medium flex items-center mr-1">
                                <TrendingUp className="w-3 h-3 mr-0.5" /> +2
                            </span>
                            ce mois-ci
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-orange-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">À Valider</CardTitle>
                        <FileText className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.documentsPending}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Documents en attente
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-green-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Performance</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98%</div>
                        <p className="text-xs text-slate-500 mt-1">Taux de couverture</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Risque Global</CardTitle>
                        <AlertCircle className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Faible</div>
                        <p className="text-xs text-slate-500 mt-1">Sur l'ensemble du portefeuille</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Sections */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Activity Feed */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Activités Récentes</CardTitle>
                        <CardDescription>Flux d'actualité de vos dossiers clients</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                        TS
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Tech Solutions SAS <span className="text-slate-500 font-normal">a ajouté 3 factures</span>
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" /> Il y a 2 heures
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Status */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>État du Cabinet</CardTitle>
                        <CardDescription>Vue macro de la période fiscale</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">TVA (Mensuelle)</span>
                                <span className="text-slate-500">8/12 déposées</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-2/3" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Liasses Fiscales</span>
                                <span className="text-slate-500">Terminé</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                Générer les relances
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
