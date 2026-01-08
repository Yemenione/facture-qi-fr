"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Download, Filter, FileSpreadsheet, File } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            // Fetch both invoices and expenses to show a global view of "Documents"
            // In a real app, this would be a unified endpoint /documents
            const [invoicesRes, expensesRes] = await Promise.all([
                // Assuming we can get all invoices for the accountant's view (or mock it)
                // Just mocking for now as we don't have a specific global endpoint
                api.get('/accountant/invoices').catch(() => ({ data: [] })),
                api.get('/accountant/expenses').catch(() => ({ data: [] }))
            ]);

            const allDocs = [
                ...invoicesRes.data.map((i: any) => ({ ...i, docType: 'INVOICE', date: i.issueDate, name: `Facture ${i.invoiceNumber}`, entity: i.client?.name })),
                ...expensesRes.data.map((e: any) => ({ ...e, docType: 'EXPENSE', date: e.date, name: `Justificatif ${e.supplier || 'Divers'}`, entity: e.supplier }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setDocuments(allDocs);
        } catch (e) {
            console.error(e);
            // Mock data for display if API fails (common in dev/partial implement)
            setDocuments(MOCK_DOCS);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocs = documents.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.entity?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">GED / Documents</h1>
                    <p className="text-slate-500 mt-1">
                        Gestion Électronique des Documents : Factures de vente et d'achat.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filtres
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" /> Export Global
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher un document..."
                            className="max-w-sm border-0 bg-slate-50 focus-visible:ring-0 pl-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Nom du document</TableHead>
                                <TableHead>Tiers (Client/Frn)</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-slate-500">
                                        Aucun document trouvé.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDocs.map((doc, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium text-slate-600">
                                            {new Date(doc.date).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={doc.docType === 'INVOICE' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}>
                                                {doc.docType === 'INVOICE' ? 'Vente' : 'Achat'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            {doc.docType === 'INVOICE' ? <FileSpreadsheet className="h-4 w-4 text-blue-500" /> : <File className="h-4 w-4 text-orange-500" />}
                                            {doc.name}
                                        </TableCell>
                                        <TableCell>{doc.entity || '-'}</TableCell>
                                        <TableCell className="font-bold">
                                            {doc.total?.toFixed(2) || doc.amount?.toFixed(2)} €
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-300 text-slate-600">
                                                {doc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4 text-slate-400 hover:text-slate-700" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

const MOCK_DOCS = [
    { docType: 'INVOICE', date: '2026-01-05', name: 'Facture F2026-001', entity: 'Tech Solutions SAS', total: 1200.00, status: 'PAID' },
    { docType: 'EXPENSE', date: '2026-01-04', name: 'Recu Uber/Train', entity: 'SNCF Voyageurs', amount: 89.50, status: 'APPROVED' },
    { docType: 'INVOICE', date: '2026-01-02', name: 'Facture F2026-002', entity: 'Boulangerie Patisserie', total: 450.00, status: 'SENT' },
    { docType: 'EXPENSE', date: '2026-01-01', name: 'Hébergement Web', entity: 'OVH Cloud', amount: 14.99, status: 'PENDING' },
    { docType: 'INVOICE', date: '2025-12-28', name: 'Facture F2025-128', entity: 'Client Inconnu', total: 3200.00, status: 'LATE' },
];
