"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface RevenueChartProps {
    data: any[]
}

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

export function RevenueChart({ data }: RevenueChartProps) {
    const chartData = data.map(d => ({
        name: MONTHS[d.month - 1],
        Revenu: d.revenue,
        TVA: d.vat
    }));

    return (
        <Card className="col-span-2 bg-white/5 border-white/10 shadow-sm">
            <CardHeader>
                <CardTitle className="text-zinc-200">Évolution du Chiffre d'Affaires</CardTitle>
                <CardDescription className="text-zinc-400">Revenu mensuel HT et TVA collectée.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis
                                dataKey="name"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#a1a1aa' }}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}€`}
                                tick={{ fill: '#a1a1aa' }}
                            />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#1E1E1E',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar
                                dataKey="Revenu"
                                name="Chiffre d'Affaires"
                                fill="#D4AF37" // Gold
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                            <Bar
                                dataKey="TVA"
                                name="TVA Collectée"
                                fill="#2563eb" // Blue
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
