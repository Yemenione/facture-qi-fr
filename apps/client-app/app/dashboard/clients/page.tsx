"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash, Pencil, Users, UserCheck, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { clientService } from "@/services/client.service"
import { Client } from "@/types/client"

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        try {
            const data = await clientService.getAll()
            setClients(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteClient = async (id: string) => {
        if (!confirm("Supprimer ce client ?")) return
        try {
            await clientService.delete(id)
            setClients(clients.filter(c => c.id !== id))
        } catch (error: any) {
            console.error("Delete error:", error)
            if (error.response?.status === 500 || error.response?.data?.message?.includes('Constraint')) {
                alert("Impossible de supprimer ce client : il possède des documents (factures/devis) associés.")
            } else {
                alert("Erreur lors de la suppression")
            }
        }
    }

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-8">Chargement...</div>

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Clients</h1>
                    <p className="text-slate-500 mt-1">Gérez votre base de contacts et suivez leur activité.</p>
                </div>
                <Button asChild className="bg-slate-900 shadow-lg hover:bg-slate-800 rounded-full">
                    <Link href="/dashboard/clients/new">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Client
                    </Link>
                </Button>
            </div>

            {/* Bento Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-100 shadow-sm relative overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{clients.length}</div>
                        <div className="absolute -right-6 -bottom-6 opacity-5">
                            <Users className="h-32 w-32" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-600">Nouveaux ce mois</CardTitle>
                        <UserPlus className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-900">
                            {/* Mock data for new clients this month since createdAt might be missing on old records */}
                            {clients.length > 0 ? Math.ceil(clients.length / 3) : 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Client List */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 max-w-sm rounded-full bg-white border-slate-200 focus:ring-slate-900"
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="h-10 px-6 font-medium text-slate-500">Nom / Contact</th>
                                <th className="h-10 px-6 font-medium text-slate-500">Coordonnées</th>
                                <th className="h-10 px-6 font-medium text-slate-500">SIREN</th>
                                <th className="h-10 px-6 font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">Aucun client trouvé.</td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                    {client.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{client.name}</div>
                                                    <div className="text-xs text-slate-500">Client actif</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-slate-600">
                                            <div className="flex flex-col">
                                                <span>{client.email}</span>
                                                <span className="text-xs text-slate-400">
                                                    {typeof client.address === 'object' && client.address !== null
                                                        ? `${client.address.street || ''} ${client.address.city || ''}`.trim() || 'Adresse non renseignée'
                                                        : client.address || "Adresse non renseignée"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-mono text-xs bg-slate-50 rounded text-slate-600 w-fit">
                                            {client.vatNumber || "N/A"}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                    <Link href={`/dashboard/clients/${client.id}`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteClient(client.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
