import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { ScrollText, User, Shield, Activity } from 'lucide-react';
import { useToast } from '../components/providers/toast-provider';

export default function ActivityLog() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await adminService.getAuditLogs();
            setLogs(data);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ScrollText className="w-6 h-6 mr-2 text-indigo-600" />
                        System Audit Logs
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Security trail of all administrative actions performed on the platform.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Loading logs...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                                                    {log.action}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-900">
                                                <span className="font-semibold text-gray-600">Admin ({log.actorId})</span> performed action on <span className="font-semibold text-gray-600">{log.targetId || 'System'}</span>
                                            </div>
                                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                <pre className="mt-2 bg-gray-50 border border-gray-100 rounded p-2 text-[10px] text-gray-500 overflow-x-auto max-w-xl">
                                                    {JSON.stringify(log.metadata, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                    {log.ipAddress && (
                                        <div className="text-xs text-gray-400 font-mono">
                                            IP: {log.ipAddress}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="p-12 text-center text-gray-400">No activity recorded yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
