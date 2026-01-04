import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    { name: 'Jan', mrr: 4000, invoices: 240 },
    { name: 'Fev', mrr: 3000, invoices: 139 },
    { name: 'Mar', mrr: 2000, invoices: 980 },
    { name: 'Avr', mrr: 2780, invoices: 390 },
    { name: 'Mai', mrr: 1890, invoices: 480 },
    { name: 'Juin', mrr: 2390, invoices: 380 },
    { name: 'Juil', mrr: 3490, invoices: 430 },
]

export default function AdminDashboard() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-black text-slate-900">GOD MODE DASHBOARD</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>MRR Growth (Revenu Récurrent)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="mrr" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Volume de Factures Générées</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="invoices" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
