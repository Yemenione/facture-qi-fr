"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Expense = {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
    proofUrl?: string;
    supplier: string;
    category?: string;
};

type Props = {
    companyId: string;
};

export default function TinderValidation({ companyId }: Props) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [companyId]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (validating) return;

            if (e.key === 'ArrowLeft') {
                handleReject();
            } else if (e.key === 'ArrowRight') {
                handleApprove();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, validating]);

    const fetchExpenses = async () => {
        try {
            const response = await api.get(`/accountant/companies/${companyId}/pending-expenses`);
            setExpenses(response.data.filter((e: Expense) => e.status === 'PENDING'));
        } catch (error) {
            console.error('Failed to fetch expenses', error);
            toast.error('Erreur lors du chargement des dépenses');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        await handleValidation('APPROVED');
    };

    const handleReject = async () => {
        await handleValidation('REJECTED');
    };

    const handleValidation = async (status: 'APPROVED' | 'REJECTED') => {
        if (currentIndex >= expenses.length) return;

        setValidating(true);
        const expense = expenses[currentIndex];

        try {
            await api.patch(`/expenses/${expense.id}/validate`, { status });

            toast.success(
                status === 'APPROVED'
                    ? '✅ Dépense approuvée'
                    : '❌ Dépense rejetée'
            );

            // Move to next
            if (currentIndex < expenses.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                toast.success('🎉 Toutes les dépenses validées!');
                fetchExpenses(); // Refresh list
            }
        } catch (error) {
            console.error('Validation failed', error);
            toast.error('Erreur lors de la validation');
        } finally {
            setValidating(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    if (expenses.length === 0) {
        return (
            <div className="text-center py-20">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">Aucune dépense en attente</h3>
                <p className="text-slate-500 mt-2">Toutes les dépenses ont été validées!</p>
            </div>
        );
    }

    if (currentIndex >= expenses.length) {
        return (
            <div className="text-center py-20">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">Validation terminée!</h3>
                <Button onClick={() => { setCurrentIndex(0); fetchExpenses(); }} className="mt-4">
                    Recommencer
                </Button>
            </div>
        );
    }

    const expense = expenses[currentIndex];

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Dépense {currentIndex + 1} sur {expenses.length}</span>
                    <span>{Math.round(((currentIndex) / expenses.length) * 100)}% complété</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${((currentIndex) / expenses.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Card */}
            <Card className="shadow-2xl border-2">
                <CardContent className="p-0">
                    {/* Receipt Image */}
                    {expense.proofUrl ? (
                        <div className="relative h-96 bg-slate-100">
                            <img
                                src={`http://localhost:3001${expense.proofUrl}`}
                                alt="Receipt"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="h-96 bg-slate-100 flex items-center justify-center">
                            <FileText className="h-24 w-24 text-slate-300" />
                        </div>
                    )}

                    {/* Details */}
                    <div className="p-6 space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold">{expense.description}</h3>
                            <p className="text-slate-500">{expense.supplier}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-bold text-blue-600">
                                    {expense.amount.toFixed(2)} €
                                </p>
                                <p className="text-sm text-slate-500">
                                    {format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}
                                </p>
                            </div>
                            {expense.category && (
                                <Badge variant="outline">{expense.category}</Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 mt-8 justify-center">
                <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleReject}
                    disabled={validating}
                    className="w-40 h-16 text-lg"
                >
                    <XCircle className="mr-2 h-6 w-6" />
                    Rejeter
                    <span className="ml-2 text-xs opacity-70">←</span>
                </Button>

                <Button
                    size="lg"
                    onClick={handleApprove}
                    disabled={validating}
                    className="w-40 h-16 text-lg bg-green-600 hover:bg-green-700"
                >
                    <CheckCircle2 className="mr-2 h-6 w-6" />
                    Approuver
                    <span className="ml-2 text-xs opacity-70">→</span>
                </Button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
                Utilisez les flèches ← → du clavier pour valider rapidement
            </p>
        </div>
    );
}
