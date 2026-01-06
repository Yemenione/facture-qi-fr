"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertTriangle, FileInput, Zap, ArrowRight, TrendingUp } from "lucide-react";

export default function AutomationPage() {
    const [stats, setStats] = useState({
        processedCount: 0,
        pendingCount: 0,
        activeConnectors: 0
    });

    useEffect(() => {
        // Here we would fetch /automation/stats
        setStats({
            processedCount: 1248,
            pendingCount: 34,
            activeConnectors: 128
        });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Centre d'Automatisation</h2>
                    <p className="text-slate-500">Supervisez la collecte et le traitement automatique des documents.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" /> Actualiser les flux
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-100/50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110" />
                    <CardHeader className="pb-2">
                        <CardDescription className="text-blue-600 font-bold flex items-center">
                            <Zap className="w-3 h-3 mr-1" />
                            Factures Traitées
                        </CardDescription>
                        <CardTitle className="text-4xl text-blue-900">{stats.processedCount.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-blue-600/80 flex items-center font-medium bg-blue-100/50 w-fit px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mois dernier
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-orange-600 font-bold flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            À Valider
                        </CardDescription>
                        <CardTitle className="text-4xl text-orange-600">{stats.pendingCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Documents incertains</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-orange-600 hover:text-orange-700 hover:bg-transparent font-medium">
                                Traiter <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-green-600 font-bold flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connecteurs Actifs
                        </CardDescription>
                        <CardTitle className="text-4xl text-green-600">{stats.activeConnectors}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-slate-500">Banques & Outils connectés</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <RefreshCw className="w-5 h-5 text-blue-600" />
                            Flux Bancaires
                        </CardTitle>
                        <CardDescription>État de la synchronisation en temps réel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all rounded-lg group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-red-500 animate-pulse ring-2 ring-red-100' : 'bg-green-500'}`} />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-slate-700">Client {i} - BNP Paribas</span>
                                            <span className="text-xs text-slate-400">Dernière synchro: 14:0{i}</span>
                                        </div>
                                    </div>
                                    {i === 3 ? (
                                        <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                            Reconnecter
                                        </Button>
                                    ) : (
                                        <div className="bg-green-100 text-green-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileInput className="w-5 h-5 text-blue-600" />
                            File d'attente OCR
                        </CardTitle>
                        <CardDescription>Factures en cours d'analyse par l'IA</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 border-t border-slate-100 min-h-[300px] bg-slate-50/50">
                        <div className="bg-green-100 p-6 rounded-full mb-4 ring-8 ring-green-50">
                             <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Tout est à jour !</h3>
                        <p className="max-w-xs mx-auto text-sm">L'intelligence artificielle a traité tous les documents en attente avec succès.</p>
                        <Button variant="outline" className="mt-8 bg-white shadow-sm">
                            Voir l'historique de traitement
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
