import { useState } from 'react'
import { Eye, LogIn, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { api } from '@/services/api'

interface Company {
    id: string
    name: string
    siren: string
    plan: 'FREE' | 'PRO' | 'ENTERPRISE'
    status: 'ACTIVE' | 'SUSPENDED'
    monthlyRevenue: number
}

export default function CompaniesList() {
    const [companies] = useState<Company[]>([
        { id: 'c1', name: 'Boulangerie Paul', siren: '123456789', plan: 'FREE', status: 'ACTIVE', monthlyRevenue: 0 },
        { id: 'c2', name: 'Tech Solutions SAS', siren: '987654321', plan: 'PRO', status: 'ACTIVE', monthlyRevenue: 29.99 },
        { id: 'c3', name: 'Mauvais Payeur SARL', siren: '112233445', plan: 'PRO', status: 'SUSPENDED', monthlyRevenue: 29.99 },
    ])

    const handleImpersonate = async (companyId: string) => {
        try {
            if (!confirm("⚠️ Attention : Vous allez vous connecter au compte de ce client. Toute action sera enregistrée.")) return;

            // 1. Request short-lived token
            const { data } = await api.post<{ token: string }>(`/admin/impersonate/${companyId}`)

            // 2. Redirect to Client App with token
            const clientAppUrl = `http://localhost:3000/auth/impersonate?token=${data.token}`
            window.open(clientAppUrl, '_blank')
        } catch (error) {
            alert("Erreur lors de la tentative de connexion (Simulation: Backend not running)")
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gestion des Entreprises</h1>
                <Badge variant="outline">{companies.length} Tenants</Badge>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Entreprise</TableHead>
                            <TableHead>SIRET</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">MRR</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell className="font-medium">{company.name}</TableCell>
                                <TableCell>{company.siren}</TableCell>
                                <TableCell>
                                    <PlanBadge plan={company.plan} />
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={company.status} />
                                </TableCell>
                                <TableCell className="text-right">{company.monthlyRevenue} €</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" title="Voir détails">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                        onClick={() => handleImpersonate(company.id)}
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Accéder
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function PlanBadge({ plan }: { plan: string }) {
    const styles: Record<string, string> = {
        FREE: "bg-gray-100 text-gray-800",
        PRO: "bg-blue-100 text-blue-800",
        ENTERPRISE: "bg-purple-100 text-purple-800",
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[plan]}`}>{plan}</span>
}

function StatusBadge({ status }: { status: string }) {
    return status === 'ACTIVE'
        ? <span className="text-green-600 font-medium">Actif</span>
        : <span className="text-red-600 font-bold flex items-center"><Ban className="w-3 h-3 mr-1" /> Bloqué</span>
}
