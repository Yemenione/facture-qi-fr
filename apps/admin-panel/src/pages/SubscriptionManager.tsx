import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { useToast } from '../components/providers/toast-provider';
import { CreditCard, Check, Plus, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscriptionManager() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null); // null = new
    const [form, setForm] = useState({ code: '', name: '', priceMonthly: 0, maxInvoices: -1, maxUsers: -1 });

    const toast = useToast();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const data = await adminService.getPlans();
            setPlans(data);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan: any) => {
        setSelectedPlan(plan);
        setForm({
            code: plan.code,
            name: plan.name,
            priceMonthly: plan.priceMonthly,
            maxInvoices: plan.maxInvoices,
            maxUsers: plan.maxUsers
        });
        setIsEditing(true);
    };

    const handleCreate = () => {
        setSelectedPlan(null);
        setForm({ code: '', name: '', priceMonthly: 0, maxInvoices: -1, maxUsers: -1 });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            if (selectedPlan) {
                await adminService.updatePlan(selectedPlan.id, form);
                toast.success("Updated", "Plan updated successfully");
            } else {
                await adminService.createPlan(form);
                toast.success("Created", "Plan created successfully");
            }
            setIsEditing(false);
            loadPlans();
        } catch (err: any) {
            toast.error("Error", err.response?.data?.message || "Failed to save plan");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan? This takes immediate effect.')) return;
        try {
            await adminService.deletePlan(id);
            toast.success("Deleted", "Plan removed");
            loadPlans();
        } catch (err: any) {
            toast.error("Error", err.response?.data?.message || "Failed to delete plan");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <CreditCard className="w-6 h-6 mr-2 text-indigo-600" />
                            Subscription Plans
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage pricing tiers and feature limits.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Plan
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? <div>Loading...</div> : plans.map((plan) => (
                        <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:border-indigo-300 transition-colors">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                                        {plan.code}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(plan)} className="text-gray-400 hover:text-indigo-600 transition"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(plan.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-3xl font-extrabold text-gray-900">€{plan.priceMonthly}</span>
                                    <span className="text-gray-500 ml-1">/month</span>
                                </div>

                                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                    <li className="flex items-start">
                                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <span>
                                            {plan.maxInvoices === -1 ? 'Unlimited' : plan.maxInvoices} Invoices
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <span>
                                            {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers} Users
                                        </span>
                                    </li>
                                    {/* Add feature parsing here later */}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-900">{selectedPlan ? 'Edit Plan' : 'New Plan'}</h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Code (Unique)</label>
                                        <input
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase"
                                            value={form.code}
                                            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                            disabled={!!selectedPlan} // Prevent changing code for existing plans
                                            placeholder="PRO"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                                        <input
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Professional"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Monthly Price (€)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        value={form.priceMonthly}
                                        onChange={e => setForm({ ...form, priceMonthly: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Max Invoices (-1 for ∞)</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                            value={form.maxInvoices}
                                            onChange={e => setForm({ ...form, maxInvoices: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Max Users (-1 for ∞)</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                            value={form.maxUsers}
                                            onChange={e => setForm({ ...form, maxUsers: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                                >
                                    Save Plan
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
