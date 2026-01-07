"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Check, FileText, Loader2, Sparkles, X } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

type Match = {
    transactionId: string;
    expenseId: string;
    confidence: number;
    reason: string;
};

export default function BankingReconciliationWidget({ companyId }: { companyId: string }) {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [reconciling, setReconciling] = useState(false);

    useEffect(() => {
        fetchData();
    }, [companyId]);

    const fetchData = async () => {
        try {
            const [txRes, expRes, matchRes] = await Promise.all([
                api.get(`/accountant/companies/${companyId}/unreconciled-transactions`),
                api.get(`/accountant/companies/${companyId}/pending-expenses`),
                api.get(`/banking/reconciliation/suggest`)
            ]);
            setTransactions(txRes.data);
            setExpenses(expRes.data);
            setMatches(matchRes.data);
        } catch (e) {
            console.error("Failed to load reconciliation data", e);
            toast.error("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleReconcile = async (transactionId: string, expenseId: string) => {
        setReconciling(true);
        try {
            await api.post('/banking/reconciliation/reconcile', {
                transactionId,
                expenseId
            });
            toast.success("✅ Rapprochement effectué!");
            fetchData(); // Refresh
        } catch (e) {
            console.error("Reconciliation failed", e);
            toast.error("Erreur lors du rapprochement");
        } finally {
            setReconciling(false);
        }
    };

    const getMatchForTransaction = (txId: string) => {
        return matches.find(m => m.transactionId === txId);
    };

    const getMatchForExpense = (expId: string) => {
        return matches.find(m => m.expenseId === expId);
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <Card className="shadow-md border-slate-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                    Rapprochement Bancaire Assisté
                </CardTitle>
                <CardDescription>
                    {matches.length > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                            <Sparkles className="h-4 w-4" />
                            {matches.length} correspondance{matches.length > 1 ? 's' : ''} suggérée{matches.length > 1 ? 's' : ''}
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Bank Side */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide border-b pb-2">
                            Relevé Bancaire ({transactions.length})
                        </h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {transactions.length === 0 && <p className="text-sm text-slate-400 italic">Aucune transaction en attente.</p>}
                            {transactions.map(tx => {
                                const match = getMatchForTransaction(tx.id);
                                const matchedExpense = match ? expenses.find(e => e.id === match.expenseId) : null;

                                return (
                                    <div
                                        key={tx.id}
                                        className={`p-3 border rounded-lg transition-all ${match
                                                ? 'bg-green-50 border-green-300 shadow-sm'
                                                : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-900 text-sm">{tx.description || "Virement / Prélèvement"}</div>
                                                <div className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('fr-FR')}</div>
                                                {match && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                                            <Sparkles className="h-3 w-3 mr-1" />
                                                            {Math.round(match.confidence * 100)}% - {match.reason}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`font-bold text-sm ${tx.amount < 0 ? 'text-slate-900' : 'text-green-600'}`}>
                                                {tx.amount.toFixed(2)} €
                                            </div>
                                        </div>
                                        {match && matchedExpense && (
                                            <div className="mt-3 pt-3 border-t border-green-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-slate-600">
                                                        → {matchedExpense.supplier || matchedExpense.description}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleReconcile(tx.id, matchedExpense.id)}
                                                        disabled={reconciling}
                                                        className="h-7 text-xs"
                                                    >
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Valider
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider Icon */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                        <div className="bg-white p-2 rounded-full shadow-lg border">
                            <ArrowRightLeft className="text-slate-400 h-6 w-6" />
                        </div>
                    </div>

                    {/* Expenses Side */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide border-b pb-2">
                            Justificatifs ({expenses.length})
                        </h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {expenses.length === 0 && <p className="text-sm text-slate-400 italic">Aucun justificatif en attente.</p>}
                            {expenses.map(exp => {
                                const match = getMatchForExpense(exp.id);

                                return (
                                    <div
                                        key={exp.id}
                                        className={`p-3 border rounded-lg transition-all ${match
                                                ? 'bg-green-50 border-green-300 shadow-sm'
                                                : 'bg-white border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-2">
                                                <div className={`p-1.5 rounded mt-0.5 ${match ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 text-sm">{exp.supplier || exp.description || "Marchand inconnu"}</div>
                                                    <div className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString('fr-FR')}</div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-sm text-slate-900">
                                                {exp.amount.toFixed(2)} €
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {matches.length === 0 && transactions.length > 0 && expenses.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-sm text-blue-700">
                            Aucune correspondance automatique trouvée. Vous pouvez rapprocher manuellement.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
