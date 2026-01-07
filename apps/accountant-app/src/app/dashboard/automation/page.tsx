"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Zap, Bot, Mail, FileText, TrendingUp,
    CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

type AutomationRule = {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    category: string;
    icon: any;
    stats?: {
        triggered: number;
        saved: string;
    };
};

export default function AutomationPage() {
    const [rules, setRules] = useState<AutomationRule[]>([
        {
            id: "1",
            name: "Validation automatique",
            description: "Valider automatiquement les dépenses < 50€ avec justificatif",
            enabled: true,
            category: "Validation",
            icon: CheckCircle2,
            stats: { triggered: 142, saved: "4.2h" }
        },
        {
            id: "2",
            name: "Rappel échéances TVA",
            description: "Envoyer un email 7 jours avant l'échéance TVA",
            enabled: true,
            category: "Notifications",
            icon: Mail,
            stats: { triggered: 24, saved: "1.5h" }
        },
        {
            id: "3",
            name: "Catégorisation intelligente",
            description: "Catégoriser automatiquement les dépenses par IA",
            enabled: false,
            category: "IA",
            icon: Bot,
            stats: { triggered: 0, saved: "0h" }
        },
        {
            id: "4",
            name: "Génération FEC automatique",
            description: "Générer le FEC le 1er de chaque mois",
            enabled: true,
            category: "Comptabilité",
            icon: FileText,
            stats: { triggered: 12, saved: "6h" }
        },
        {
            id: "5",
            name: "Rapprochement bancaire",
            description: "Suggérer automatiquement les correspondances",
            enabled: true,
            category: "Banque",
            icon: TrendingUp,
            stats: { triggered: 89, saved: "8.5h" }
        }
    ]);

    const toggleRule = (id: string) => {
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
        ));
        toast.success("Règle mise à jour");
    };

    const totalTimeSaved = rules.reduce((acc, rule) => {
        if (!rule.stats) return acc;
        const hours = parseFloat(rule.stats.saved);
        return acc + hours;
    }, 0);

    const totalTriggered = rules.reduce((acc, rule) =>
        acc + (rule.stats?.triggered || 0), 0
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
                <p className="text-slate-500 mt-2">
                    Automatisez vos tâches répétitives et gagnez du temps
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Règles actives
                        </CardTitle>
                        <Zap className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {rules.filter(r => r.enabled).length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            sur {rules.length} règles
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Déclenchements
                        </CardTitle>
                        <Clock className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {totalTriggered}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            ce mois-ci
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Temps gagné
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {totalTimeSaved.toFixed(1)}h
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            ce mois-ci
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Rules List */}
            <Card>
                <CardHeader>
                    <CardTitle>Règles d'automation</CardTitle>
                    <CardDescription>
                        Activez ou désactivez les règles selon vos besoins
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {rules.map((rule) => {
                        const Icon = rule.icon;
                        return (
                            <div
                                key={rule.id}
                                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className={`p-3 rounded-lg ${rule.enabled ? 'bg-blue-100' : 'bg-slate-100'
                                    }`}>
                                    <Icon className={`h-6 w-6 ${rule.enabled ? 'text-blue-600' : 'text-slate-400'
                                        }`} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{rule.name}</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {rule.category}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {rule.description}
                                    </p>
                                    {rule.stats && (
                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                            <span>
                                                {rule.stats.triggered} déclenchements
                                            </span>
                                            <span>•</span>
                                            <span className="text-green-600 font-medium">
                                                {rule.stats.saved} gagnées
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Switch
                                    checked={rule.enabled}
                                    onCheckedChange={() => toggleRule(rule.id)}
                                />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Coming Soon */}
            <Card className="border-dashed">
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Bot className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">
                            Plus de règles bientôt disponibles
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Nous travaillons sur de nouvelles automations IA
                        </p>
                        <Button variant="outline" className="mt-4">
                            Suggérer une règle
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
