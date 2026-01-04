import { useState } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Subscription {
    companyId: string
    companyName: string
    stripeStatus: 'active' | 'past_due' | 'canceled' | 'manual_override'
    nextBillingDate: string
    amount: number
}

export default function SubscriptionManager() {
    const [subscriptions] = useState<Subscription[]>([
        { companyId: 'c1', companyName: 'StartUp Fragile', stripeStatus: 'past_due', nextBillingDate: '2026-01-05', amount: 29.99 },
        { companyId: 'c2', companyName: 'Grosse Boite', stripeStatus: 'active', nextBillingDate: '2026-02-01', amount: 99.99 },
    ])

    const toggleManualOverride = (id: string, currentState: boolean) => {
        console.log(`Toggling override for ${id} to ${currentState}`)
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold flex items-center">
                <RefreshCcw className="mr-3" /> Abonnements & Revenus
            </h1>

            <Card className="border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-700 flex items-center">
                        <AlertTriangle className="mr-2" /> Risque de Churn (Paiements échoués)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {subscriptions.filter(s => s.stripeStatus === 'past_due').map(sub => (
                            <div key={sub.companyId} className="flex justify-between items-center bg-white p-4 rounded shadow-sm">
                                <div>
                                    <p className="font-bold">{sub.companyName}</p>
                                    <p className="text-sm text-red-500">Paiement échoué le {sub.nextBillingDate}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right mr-4">
                                        <p className="text-xl font-mono font-bold">{sub.amount} €</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label className="text-xs font-medium">Forcer l'accès</label>
                                        <Switch
                                            checked={false} // dummy state for blueprint
                                            onChange={(e) => toggleManualOverride(sub.companyId, e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
