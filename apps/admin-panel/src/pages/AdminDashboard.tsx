import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { Building2, Users, TrendingUp, Activity, Euro } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

// Mock Data for Charts
const data = [
    { name: 'Jan', revenue: 4000, users: 240 },
    { name: 'Feb', revenue: 3000, users: 139 },
    { name: 'Mar', revenue: 2000, users: 980 },
    { name: 'Apr', revenue: 2780, users: 390 },
    { name: 'May', revenue: 1890, users: 480 },
    { name: 'Jun', revenue: 2390, users: 380 },
    { name: 'Jul', revenue: 3490, users: 430 },
];

const Card = ({ children, className = "", title, icon: Icon }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col ${className}`}
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        </div>
        {children}
    </motion.div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ companies: 0, invoices: 0, mrr: 12500 });

    useEffect(() => {
        // Load real stats
        adminService.getCompanies().then(companies => {
            const totalInvoices = companies.reduce((acc: number, curr: any) => acc + (curr.invoicesCount || 0), 0);
            setStats(prev => ({ ...prev, companies: companies.length, invoices: totalInvoices }));
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Super Admin.</p>
                </div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[500px]">

                    {/* 1. MRR - Large Chart (2x2) */}
                    <Card title="Revenue (MRR)" icon={Euro} className="md:col-span-2 md:row-span-2">
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-bold text-gray-900">{stats.mrr.toLocaleString()} €</span>
                            <span className="text-green-500 text-sm font-medium flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
                            </span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* 2. Total Companies */}
                    <Card title="Active Companies" icon={Building2} className="md:col-span-1">
                        <div className="mt-2">
                            <span className="text-3xl font-bold">{stats.companies}</span>
                            <p className="text-sm text-gray-500 mt-1">Total Registered</p>
                        </div>
                    </Card>

                    {/* 3. System Health */}
                    <Card title="System Health" icon={Activity} className="md:col-span-1">
                        <div className="flex items-center gap-3 mt-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-lg font-medium text-green-700">Operational</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">API Latency: 45ms</p>
                    </Card>

                    {/* 4. Recent Growth (Bar Chart) */}
                    <Card title="New Signups" icon={Users} className="md:col-span-2">
                        <div className="flex-1 min-h-0 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" hide />
                                    <Tooltip />
                                    <Bar dataKey="users" fill="#818CF8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
