"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft, Loader2, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import BankingReconciliationWidget from "@/components/BankingReconciliationWidget";
import TinderValidation from "@/components/TinderValidation";
import api from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Expense = {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    proofUrl?: string;
    supplier: string;
};

type CompanyDetails = {
    id: string;
    name: string;
    siren: string;
    email: string;
    address: string;
    subscriptionPlan: string;
};

export default function CompanyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<CompanyDetails | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'reconciliation'>('overview');

    useEffect(() => {
        if (params.id) {
            fetchData(params.id as string);
        }
    }, [params]);

    const fetchData = async (id: string) => {
        try {
            // Fetch company details and expenses
            // Note: In a real app we might want separate endpoints or a single 'details' endpoint
            // For now, reusing existing or assuming new endpoints
            const [companyRes, expensesRes] = await Promise.all([
                api.get(`/accountant/companies/${id}`),
                api.get(`/accountant/companies/${id}/expenses`)
            ]);

            setCompany(companyRes.data);
            setExpenses(expensesRes.data);
        } catch (e) {
            console.error("Failed to load details", e);
            toast.error("Erreur lors du chargement du dossier.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (expenseId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.patch(`/accountant/companies/${params.id}/expenses/${expenseId}/status`, { status });
            toast.success(`Document ${status === 'APPROVED' ? 'validé' : 'rejeté'} avec succès`);

            // Optimistic update
            setExpenses(prev => prev.map(e =>
                e.id === expenseId ? { ...e, status } : e
            ));
        } catch (e) {
            console.error("Update failed", e);
            toast.error("Impossible de mettre à jour le statut.");
        }
    };

    const handleImpersonate = async () => {
        if (!company) return;
        try {
            const token = localStorage.getItem('accountant_token');
            const response = await fetch(`http://localhost:3001/accountant/companies/${company.id}/impersonate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                toast.error("Impossible d'accéder au compte client.");
            }
        } catch (e) {
            console.error("Impersonation failed", e);
            toast.error("Impossible d'accéder au compte client.");
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    }

    if (!company) {
        return <div className="text-center py-10">Dossier introuvable</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{company.name}</h1>
                    <p className="text-sm text-slate-500">SIREN: {company.siren}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" onClick={() => window.open(`http://localhost:3001/accounting/custom/fec/${company.id}?year=${new Date().getFullYear()}`, '_blank')}>
                        <Download className="w-4 h-4 mr-2" /> FEC {new Date().getFullYear()}
                    </Button>
                    <Button onClick={handleImpersonate}>
                        Accéder au compte client
                    </Button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mt-6 border-b border-slate-200">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'overview'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Vue d'ensemble
                    </button>
                    <button
                        onClick={() => setActiveTab('validation')}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'validation'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        🔥 Validation Express
                    </button>
                    <button
                        onClick={() => setActiveTab('reconciliation')}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'reconciliation'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        💰 Rapprochement Bancaire
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {activeTab === 'validation' && (
                    <TinderValidation companyId={company.id} />
                )}

                {activeTab === 'reconciliation' && (
                    <BankingReconciliationWidget companyId={company.id} />
                )}

                {activeTab === 'overview' && (
                    <>
                        {/* Other details can follow */}

                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-slate-500">Abonnement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold">{company.subscriptionPlan}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-slate-500">Documents en attente</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold text-orange-600">
                                        {expenses.filter(e => e.status === 'PENDING').length}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-slate-500">Contact</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm">{company.email}</div>
                                    <div className="text-sm text-slate-500">{company.address}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Documents & Justificatifs</CardTitle>
                                <CardDescription>Validez ou rejetez les pièces comptables transmises par le client.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                            <tr>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Fournisseur</th>
                                                <th className="p-4">Description</th>
                                                <th className="p-4">Montant</th>
                                                <th className="p-4">Statut</th>
                                                <th className="p-4">Pièce</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {expenses.map(expense => (
                                                <tr key={expense.id} className="hover:bg-slate-50">
                                                    <td className="p-4">{format(new Date(expense.date), 'dd/MM/yyyy')}</td>
                                                    <td className="p-4 font-medium">{expense.supplier}</td>
                                                    <td className="p-4 text-slate-500">{expense.description}</td>
                                                    <td className="p-4 font-bold">{expense.amount.toFixed(2)} €</td>
                                                    <td className="p-4">
                                                        {expense.status === 'PENDING' && <Badge variant="secondary" className="bg-orange-100 text-orange-700">En attente</Badge>}
                                                        {expense.status === 'APPROVED' && <Badge variant="secondary" className="bg-green-100 text-green-700">Validé</Badge>}
                                                        {expense.status === 'REJECTED' && <Badge variant="secondary" className="bg-red-100 text-red-700">Rejeté</Badge>}
                                                    </td>
                                                    <td className="p-4">
                                                        {expense.proofUrl ? (
                                                            <a
                                                                href={`http://localhost:3001${expense.proofUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center text-blue-600 hover:underline"
                                                            >
                                                                <FileText className="w-4 h-4 mr-1" /> Voir
                                                            </a>
                                                        ) : (
                                                            <span className="text-slate-400">Aucune</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        {expense.status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-green-600 hover:bg-green-50"
                                                                    onClick={() => handleStatusUpdate(expense.id, 'APPROVED')}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleStatusUpdate(expense.id, 'REJECTED')}
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
