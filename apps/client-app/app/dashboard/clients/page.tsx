
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Removed missing components imports
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
        } catch (error) {
            alert("Erreur lors de la suppression")
        }
    }

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">Gérez votre base de clients et contacts.</p>
                </div>
                <Link href="/dashboard/clients/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Nouveau Client
                    </Button>
                </Link>
            </div>

            <div className="flex items-center py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Nom</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">SIREN</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr className="border-b">
                                    <td colSpan={5} className="p-4 align-middle text-center">Chargement...</td>
                                </tr>
                            ) : filteredClients.length === 0 ? (
                                <tr className="border-b">
                                    <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">Aucun client trouvé.</td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{client.name}</td>
                                        <td className="p-4 align-middle">{client.email}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`px-2 py-1 rounded-full text-xs ${client.isBusiness ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {client.isBusiness ? 'Entreprise' : 'Particulier'}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">{client.siren || '-'}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm" onClick={() => deleteClient(client.id)} className="text-red-500 hover:text-red-600">
                                                <Trash className="h-4 w-4" />
                                            </Button>
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

