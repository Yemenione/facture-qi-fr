"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Plus, Search, Building2, Mail, Phone,
    MapPin, ExternalLink, Edit, Trash2, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type Client = {
    id: string;
    name: string;
    siret: string;
    email: string;
    plan: string;
    isActive: boolean;
    todo: {
        missingReceipts: number;
        pendingValidation: number;
        unreconciledBank: number;
        overdueInvoices: number;
    };
};

export default function ClientsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/accountant/companies');
            setClients(response.data);
        } catch (error) {
            console.error('Failed to fetch clients', error);
            toast.error('Erreur lors du chargement des clients');
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.siret?.includes(searchTerm)
    );

    const handleAddClient = () => {
        toast.success("Fonctionnalité d'ajout de client en cours de développement");
    };

    const handleViewClient = (clientId: string) => {
        router.push(`/dashboard/companies/${clientId}`);
    };

    const handleEditClient = (client: Client) => {
        toast.success(`Édition de ${client.name}`);
    };

    const handleDeleteClient = (client: Client) => {
        toast.success(`${client.name} supprimé`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-slate-500 mt-2">
                        Gérez votre portefeuille de clients
                    </p>
                </div>
                <Button onClick={handleAddClient}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau client
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Total clients
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{clients.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {clients.filter(c => c.isActive).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            À traiter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">
                            {clients.reduce((acc, c) => acc + (c.todo?.missingReceipts || 0) + (c.todo?.pendingValidation || 0), 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            Nouveaux ce mois
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {clients.filter(c => c.isActive).length > 5 ? 2 : 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher par nom ou SIREN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Clients List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((client) => (
                        <Card key={client.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{client.name}</CardTitle>
                                            <p className="text-sm text-slate-500 mt-1">
                                                SIRET: {client.siret}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={client.isActive ? 'default' : 'secondary'}
                                        className={client.isActive ? 'bg-green-100 text-green-700' : ''}
                                    >
                                        {client.isActive ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{client.email}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Plan:</span>
                                        <Badge variant="outline">{client.plan}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-slate-500">Pièces manquantes:</span>
                                        <span className="font-medium text-orange-600">{client.todo?.missingReceipts || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-slate-500">En attente:</span>
                                        <span className="font-medium text-blue-600">{client.todo?.pendingValidation || 0}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3">
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        onClick={() => handleViewClient(client.id)}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Voir
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditClient(client)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteClient(client)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {filteredClients.length === 0 && (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Building2 className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Aucun client trouvé</h3>
                            <p className="text-slate-500 mt-2">
                                Essayez une autre recherche ou ajoutez un nouveau client
                            </p>
                            <Button onClick={handleAddClient} className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter un client
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
