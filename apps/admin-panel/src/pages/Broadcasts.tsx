import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { useToast } from '../components/providers/toast-provider';
import { Radio, AlertCircle, CheckCircle, Info, Trash2, Power, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Broadcasts() {
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newBroadcast, setNewBroadcast] = useState({ title: '', message: '', type: 'INFO', isActive: true });
    const toast = useToast();

    useEffect(() => {
        loadBroadcasts();
    }, []);

    const loadBroadcasts = async () => {
        try {
            const data = await adminService.getBroadcasts();
            setBroadcasts(data);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load broadcasts");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newBroadcast.title || !newBroadcast.message) return;
        try {
            await adminService.createBroadcast(newBroadcast);
            toast.success("Created", "Broadcast created successfully.");
            setIsCreating(false);
            setNewBroadcast({ title: '', message: '', type: 'INFO', isActive: true });
            loadBroadcasts();
        } catch (err) {
            toast.error("Error", "Failed to create broadcast");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await adminService.deleteBroadcast(id);
            toast.success("Deleted", "Broadcast removed.");
            loadBroadcasts();
        } catch (err) {
            toast.error("Error", "Failed to delete broadcast");
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await adminService.toggleBroadcastStatus(id, !currentStatus);
            loadBroadcasts();
        } catch (err) {
            toast.error("Error", "Failed to toggle status");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'WARNING': return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'CRITICAL': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Radio className="w-6 h-6 mr-2 text-indigo-600" />
                            Broadcast System
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Send global announcements to all users on the platform.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Broadcast
                    </button>
                </div>

                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg"
                    >
                        <h3 className="font-bold text-gray-900 mb-4">Draft Announcement</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={newBroadcast.title}
                                    onChange={e => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                                    placeholder="e.g. Scheduled Maintenance"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="w-full border p-2 rounded h-24"
                                    value={newBroadcast.message}
                                    onChange={e => setNewBroadcast({ ...newBroadcast, message: e.target.value })}
                                    placeholder="Details about the announcement..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                <div className="flex gap-4">
                                    {['INFO', 'WARNING', 'CRITICAL', 'SUCCESS'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewBroadcast({ ...newBroadcast, type })}
                                            className={`px-3 py-1 text-xs rounded border ${newBroadcast.type === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'border-gray-200 text-gray-600'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                <button onClick={handleCreate} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Publish Broadcast</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {loading ? <div className="text-center py-10 opacity-50">Loading...</div> : broadcasts.map((item) => (
                        <div key={item.id} className={`bg-white p-6 rounded-lg border ${item.isActive ? 'border-green-200 shadow-sm' : 'border-gray-200 opacity-70'} flex justify-between items-start`}>
                            <div className="flex gap-4">
                                <div className="mt-1">{getTypeIcon(item.type)}</div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                                        {!item.isActive && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">INACTIVE</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                                    <span className="text-xs text-gray-400 mt-3 block">{new Date(item.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggle(item.id, item.isActive)}
                                    className={`p-2 rounded hover:bg-gray-100 transition ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}
                                    title={item.isActive ? "Deactivate" : "Activate"}
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {broadcasts.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                            No active broadcasts.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
