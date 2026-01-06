"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Filter, Download, Eye, MoreVertical, FolderOpen } from "lucide-react";

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const documents = [
        { id: 1, name: "Facture F2026-001.pdf", client: "Tech Solutions SAS", type: "Facture Vente", date: "05/01/2026", size: "1.2 MB" },
        { id: 2, name: "Relevé Bancaire Dec 2025.pdf", client: "Boulangerie Durand", type: "Banque", date: "04/01/2026", size: "3.4 MB" },
        { id: 3, name: "Kbis-2026.pdf", client: "Garage Auto Plus", type: "Juridique", date: "02/01/2026", size: "0.8 MB" },
        { id: 4, name: "Facture Achat-002.pdf", client: "Tech Solutions SAS", type: "Facture Achat", date: "02/01/2026", size: "0.5 MB" },
        { id: 5, name: "URSSAF Q4 2025.pdf", client: "Tech Solutions SAS", type: "Social", date: "01/01/2026", size: "1.2 MB" },
    ];

    const filteredDocs = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestion Documentaire (GED)</h2>
                    <p className="text-slate-500">Accédez à l'ensemble des pièces comptables de vos clients.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <FolderOpen className="mr-2 h-4 w-4" /> Dossiers
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" /> Export en masse
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <Button variant="secondary" size="sm" className="bg-slate-900 text-white hover:bg-slate-800">Tout ({documents.length})</Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Achat</Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Vente</Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Banque</Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">Juridique</Button>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Rechercher (Client, Fichier)..." 
                                    className="pl-9 h-9" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="w-[40%]">Nom du fichier</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date d'ajout</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc) => (
                                <TableRow key={doc.id} className="hover:bg-slate-50 group cursor-pointer transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-slate-700 group-hover:text-blue-600 table-cell-transition">{doc.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{doc.client}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                                            doc.type.includes('Vente') ? 'bg-green-50 text-green-700 border-green-100' :
                                            doc.type.includes('Achat') ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            doc.type.includes('Banque') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}>
                                            {doc.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-500">{doc.date}</TableCell>
                                    <TableCell className="text-slate-500">{doc.size}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
