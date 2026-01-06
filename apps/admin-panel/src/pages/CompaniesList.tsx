import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { Company, User } from 'lucide-react';
import { LayoutDashboard, Users, CreditCard, Search, MoreVertical, Shield, Trash2, Edit, AlertCircle, ToggleLeft, ToggleRight, Settings } from 'lucide-react';
import { useToast } from '../components/providers/toast-provider';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompaniesList() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('general'); // 'general' or 'features'
    const [editForm, setEditForm] = useState<any>({});
    const toast = useToast();

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const data = await adminService.getCompanies();
            setCompanies(data);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = async (id: string) => {
        try {
            await adminService.impersonate(id);
        } catch (err) {
            toast.error("Error", "Impersonation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('EXTREME WARNING: This will delete the company and ALL its data. Proceed?')) return;
        try {
            await adminService.deleteCompany(id);
            toast.success("Deleted", "Company deleted permanently.");
            loadCompanies();
        } catch (err) {
            toast.error("Error", "Failed to delete company");
        }
    };

    const openEditModal = (company: any) => {
        setSelectedCompany(company);
        setActiveTab('general');
        setEditForm({
            name: company.name,
            email: company.email,
            planCode: company.subscriptionPlan,
            isActive: company.isActive,
            stripeCustomerId: company.stripeCustomerId || '',
            features: company.features || {}
        });
    };

    const handleFeatureToggle = (featureKey: string) => {
        const current = editForm.features[featureKey];
        setEditForm({
            ...editForm,
            features: {
                ...editForm.features,
                [featureKey]: !current
            }
        });
    };

    const handleUpdate = async () => {
        try {
            await adminService.updateCompany(selectedCompany.id, editForm);
            toast.success("Updated", "Company details updated successfully.");
            setSelectedCompany(null);
            loadCompanies();
        } catch (err) {
            toast.error("Error", "Failed to update company");
        }
    };

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <LayoutDashboard className="w-6 h-6 mr-2 text-indigo-600" />
                            Companies
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all registered tenants and their subscriptions.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Stats</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading...</td></tr>
                            ) : filtered.map(company => (
                                <tr key={company.id} className="hover:bg-gray-50 transition group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold mr-3">
                                                {company.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{company.name}</div>
                                                <div className="text-xs text-gray-400">{company.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${company.subscriptionPlan === 'AGENCY' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                company.subscriptionPlan === 'PRO' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                            {company.subscriptionPlan || 'FREE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${company.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${company.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {company.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                            <div title="Users" className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" /> {company.usersCount}
                                            </div>
                                            <div title="Invoices" className="flex items-center gap-1">
                                                <CreditCard className="w-3.5 h-3.5" /> {company.invoicesCount}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleImpersonate(company.id)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                title="Log in as this company"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(company)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                title="Edit details"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                title="Delete company"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {selectedCompany && (
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
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-900">Edit Company</h3>
                                <button onClick={() => setSelectedCompany(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 px-6 space-x-6">
                                <button
                                    onClick={() => setActiveTab('general')}
                                    className={`py-3 text-sm font-medium border-b-2 transition ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    General
                                </button>
                                <button
                                    onClick={() => setActiveTab('features')}
                                    className={`py-3 text-sm font-medium border-b-2 transition ${activeTab === 'features' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Features & Limits
                                </button>
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                {activeTab === 'general' ? (
                                    <>
                                        {/* Basic Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Company Name</label>
                                                <input
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Owner Email</label>
                                                <input
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    value={editForm.email}
                                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Plan & Status */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Subscription Plan</label>
                                                <select
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                                    value={editForm.planCode}
                                                    onChange={e => setEditForm({ ...editForm, planCode: e.target.value })}
                                                >
                                                    <option value="FREE">Free</option>
                                                    <option value="PRO">Pro</option>
                                                    <option value="AGENCY">Agency</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Account Status</label>
                                                <div className="flex items-center h-[38px]">
                                                    <button
                                                        onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${editForm.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        {editForm.isActive ? 'Active' : 'Suspended'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stripe */}
                                        <div className="pt-2 border-t border-gray-100">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Stripe Customer ID</label>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-gray-400" />
                                                <input
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                                                    value={editForm.stripeCustomerId}
                                                    placeholder="cus_..."
                                                    onChange={e => setEditForm({ ...editForm, stripeCustomerId: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex items-start gap-3">
                                            <Settings className="w-5 h-5 text-indigo-600 mt-0.5" />
                                            <p className="text-xs text-indigo-800">
                                                Feature flags allow you to enable specific beta features or override plan limits for this specific company.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {['api_access', 'can_remove_branding', 'beta_features', 'priority_support'].map(feature => (
                                                <div key={feature} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                                                    <span className="text-sm font-medium text-gray-700 capitalize">{feature.replace(/_/g, ' ')}</span>
                                                    <button
                                                        onClick={() => handleFeatureToggle(feature)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.features[feature] ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.features[feature] ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedCompany(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
