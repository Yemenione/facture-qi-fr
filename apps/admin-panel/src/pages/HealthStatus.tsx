import { useState } from 'react';
import { Activity, Server, Clock, CheckCircle, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

// Mock data types
interface SystemComponent {
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    latency: number;
    uptime: number; // 99.9%
}

export default function HealthStatus() {
    const [components, setComponents] = useState<SystemComponent[]>([
        { name: 'API Server', status: 'operational', latency: 45, uptime: 99.98 },
        { name: 'Database (MongoDB)', status: 'operational', latency: 12, uptime: 99.99 },
        { name: 'Storage (S3)', status: 'operational', latency: 120, uptime: 99.95 },
        { name: 'Email Service (SMTP)', status: 'operational', latency: 300, uptime: 99.50 },
        { name: 'Stripe Webhooks', status: 'operational', latency: 85, uptime: 100 },
        { name: 'PDF Generation', status: 'degraded', latency: 1500, uptime: 98.40 },
    ]);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-green-500';
            case 'degraded': return 'text-yellow-500';
            case 'outage': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'outage': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Activity className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Activity className="w-6 h-6 mr-2 text-indigo-600" />
                            System Maintenance & Health
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Real-time system performance and operational status.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Last updated</div>
                        <div className="font-mono text-gray-700">{lastUpdated.toLocaleTimeString()}</div>
                    </div>
                </div>

                {/* Overall Status Banner */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center">
                    <ShieldCheck className="w-12 h-12 text-green-600 mr-4" />
                    <div>
                        <h2 className="text-lg font-semibold text-green-800">All Systems Operational</h2>
                        <p className="text-green-700">Platform is running smoothly. No active incidents reported.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Uptime Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Overall Uptime (30d)</h3>
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">99.98%</div>
                        <div className="text-sm text-green-600 mt-1">↑ 0.01% from last month</div>
                    </div>

                    {/* Avg Latency */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Avg. API Latency</h3>
                            <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">45ms</div>
                        <div className="text-sm text-green-600 mt-1">Optimal performance</div>
                    </div>

                    {/* Active Connections */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Active Websockets</h3>
                            <Server className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">1,240</div>
                        <div className="text-sm text-gray-500 mt-1">across 3 regions</div>
                    </div>
                </div>

                {/* Detailed Components Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 font-medium text-gray-900 flex items-center">
                        <Server className="w-5 h-5 mr-2 text-gray-500" />
                        Component Status
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Component</th>
                                <th className="px-6 py-3 font-medium">Latency</th>
                                <th className="px-6 py-3 font-medium">Uptime (24h)</th>
                                <th className="px-6 py-3 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {components.map((c, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                    <td className="px-6 py-4 font-mono text-gray-600">{c.latency}ms</td>
                                    <td className="px-6 py-4 text-gray-600">{c.uptime}%</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`capitalize font-medium ${getStatusColor(c.status)}`}>
                                                {c.status}
                                            </span>
                                            {getStatusIcon(c.status)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
