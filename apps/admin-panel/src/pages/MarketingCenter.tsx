import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { Megaphone, Send, Users, RefreshCw } from 'lucide-react';
import { useToast } from '../components/providers/toast-provider';

export default function MarketingCenter() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ subject: '', content: '', segment: 'ALL' });
    const toast = useToast();

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const data = await adminService.getCampaigns();
            setCampaigns(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createCampaign(form);
            toast.success("Sent", "Campaign has been queued for sending.");
            setForm({ subject: '', content: '', segment: 'ALL' });
            loadCampaigns();
        } catch (err) {
            toast.error("Error", "Failed to send campaign.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Megaphone className="w-6 h-6 mr-2 text-indigo-600" />
                        Marketing Command Center
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage email campaigns and user engagement.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Compose Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Send className="w-4 h-4 text-gray-400" />
                                Compose Campaign
                            </h2>
                            <form onSubmit={handleSend} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Audience Segment</label>
                                        <select
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={form.segment}
                                            onChange={e => setForm({ ...form, segment: e.target.value })}
                                        >
                                            <option value="ALL">All Users</option>
                                            <option value="ACTIVE">Active Subscriptions</option>
                                            <option value="PRO_PLAN">Pro Plan Only</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Subject Line</label>
                                        <input
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. New Features Available!"
                                            required
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email Content (HTML)</label>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-48 font-mono bg-gray-50"
                                        placeholder="<h1>Hello, user!</h1>..."
                                        required
                                        value={form.content}
                                        onChange={e => setForm({ ...form, content: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Campaign
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* History Card */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
                                <h3 className="font-bold text-sm text-gray-900">Campaign History</h3>
                                <button onClick={loadCampaigns} className="text-gray-400 hover:text-indigo-600">
                                    <RefreshCw className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[500px] p-2 space-y-2">
                                {campaigns.map(c => (
                                    <div key={c.id} className="p-3 bg-white border border-gray-100 rounded-lg hover:border-indigo-100 transition shadow-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-gray-800 text-sm">{c.subject}</span>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{c.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-2 truncate">{c.content.substring(0, 50)}...</div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {c.sentCount} sent
                                            </span>
                                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                {campaigns.length === 0 && !loading && (
                                    <div className="text-center p-8 text-gray-400 text-xs">No campaigns sent yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
