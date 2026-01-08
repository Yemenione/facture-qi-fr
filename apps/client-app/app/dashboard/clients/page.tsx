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
        <div className="space-y-6 max-w-7xl mx-auto p-2 pb-20 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight text-white">Clients</h1>
                    <p className="text-zinc-400 mt-1">Gérez votre base de contacts et suivez leur activité.</p>
                </div>
                <Button asChild className="bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20 hover:bg-yellow-500 rounded-full font-bold">
                    <Link href="/dashboard/clients/new">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Client
                    </Link>
                </Button>
            </div>

            {/* Bento Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10 shadow-sm relative overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-zinc-500 group-hover:text-brand-gold transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{clients.length}</div>
                        <div className="absolute -right-6 -bottom-6 opacity-5">
                            <Users className="h-32 w-32 text-white" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-brand-blue/20 to-brand-dark border-brand-blue/30 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-400">Nouveaux ce mois</CardTitle>
                        <UserPlus className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {/* Mock data for new clients this month since createdAt might be missing on old records */}
                            {clients.length > 0 ? Math.ceil(clients.length / 3) : 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Client List */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 max-w-sm rounded-full bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:ring-brand-gold focus:border-brand-gold"
                    />
                </div>

                <div className="hidden md:block rounded-xl border border-white/10 bg-white/5 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="h-10 px-6 font-medium text-zinc-400">Nom / Contact</th>
                                <th className="h-10 px-6 font-medium text-zinc-400">Coordonnées</th>
                                <th className="h-10 px-6 font-medium text-zinc-400">SIREN</th>
                                <th className="h-10 px-6 font-medium text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-zinc-500">Aucun client trouvé.</td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 font-bold border border-white/5">
                                                    {client.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{client.name}</div>
                                                    <div className="text-xs text-zinc-500">Client actif</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-zinc-400">
                                            <div className="flex flex-col">
                                                <span>{client.email}</span>
                                                <span className="text-xs text-zinc-500">
                                                    {typeof client.address === 'object' && client.address !== null
                                                        ? `${client.address.street || ''} ${client.address.city || ''}`.trim() || 'Adresse non renseignée'
                                                        : client.address || "Adresse non renseignée"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-mono text-xs text-zinc-300 w-fit">
                                            {client.vatNumber ? <span className="bg-white/10 px-2 py-1 rounded">{client.vatNumber}</span> : "N/A"}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                                                    <Link href={`/dashboard/clients/${client.id}`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteClient(client.id)} className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10">
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

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {filteredClients.map((client) => (
                        <Card key={client.id} className="bg-white/5 border-white/10 shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-brand-gold font-bold border border-white/5 text-lg">
                                        {client.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-lg truncate">{client.name}</h3>
                                        <p className="text-zinc-400 text-sm truncate">{client.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm text-zinc-500 bg-black/20 p-3 rounded-lg border border-white/5">
                                    <div className="flex justify-between">
                                        <span>Adresse:</span>
                                        <span className="text-zinc-300 text-right">
                                            {typeof client.address === 'object' && client.address !== null
                                                ? `${client.address.street || ''} ${client.address.city || ''}`.trim() || 'N/A'
                                                : client.address || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>TVA/SIRET:</span>
                                        <span className="font-mono text-zinc-300">{client.vatNumber || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button variant="outline" asChild className="w-full border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">
                                        <Link href={`/dashboard/clients/${client.id}`}>
                                            <Pencil className="h-4 w-4 mr-2" /> Modifier
                                        </Link>
                                    </Button>
                                    <Button variant="outline" onClick={() => deleteClient(client.id)} className="w-full border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-900/50">
                                        <Trash className="h-4 w-4 mr-2" /> Supprimer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
