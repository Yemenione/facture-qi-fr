"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Plus, Search, MoreHorizontal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import clientService from "@/services/client.service"

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        try {
            const data = await clientService.findAll()
            setClients(data)
        } catch (error) {
            console.error("Failed to load clients", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">Gérez votre base de clients.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/clients/new">
                        <Plus className="mr-2 h-4 w-4" /> Ajouter un client
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des clients</CardTitle>
                    <CardDescription>
                        Vos clients enregistrés.
                    </CardDescription>
                    <div className="pt-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher un client..." className="pl-8 max-w-sm" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="h-12 px-4 align-middle font-medium">Nom</th>
                                    <th className="h-12 px-4 align-middle font-medium">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium">Téléphone</th>
                                    <th className="h-12 px-4 align-middle font-medium text-center">Siret</th>
                                    <th className="h-12 px-4 align-middle font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center">Chargement...</td>
                                    </tr>
                                ) : clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center">Aucun client trouvé.</td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                {client.name}
                                            </td>
                                            <td className="p-4 align-middle">{client.email}</td>
                                            <td className="p-4 align-middle">{client.phone || '-'}</td>
                                            <td className="p-4 align-middle text-center">{client.siren || '-'}</td>
                                            <td className="p-4 align-middle text-right">
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Menu</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
