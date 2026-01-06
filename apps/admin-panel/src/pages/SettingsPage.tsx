import { useState } from 'react';
import { useToast } from '../components/providers/toast-provider';
import { Save, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [showKey, setShowKey] = useState(false);
    // Mock initial config
    const [config, setConfig] = useState({
        stripeParams: {
            publishableKey: 'pk_test_...',
            secretKey: 'sk_test_...',
            webhookSecret: 'whsec_...'
        },
        maintenanceMode: false
    });
    const toast = useToast();

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings Saved", "Platform configuration updated successfully.");
        }, 1000);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 mt-1">Configure global parameters, integrations, and security.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* SETTINGS SIDEBAR NAV (Could be implemented if page grows) */}
                <div className="col-span-1 space-y-1">
                    <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg">General & Stripe</button>
                    <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Email (SMTP)</button>
                    <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Security</button>
                </div>

                {/* MAIN CONTENT */}
                <div className="col-span-2 space-y-6">

                    {/* STRIPE CONFIG */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Lock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Stripe Integration</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                                <input
                                    type="text"
                                    value={config.stripeParams.publishableKey}
                                    onChange={(e) => setConfig({ ...config, stripeParams: { ...config.stripeParams, publishableKey: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={config.stripeParams.secretKey}
                                        onChange={(e) => setConfig({ ...config, stripeParams: { ...config.stripeParams, secretKey: e.target.value } })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm pr-10"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                                <input
                                    type="text"
                                    value={config.stripeParams.webhookSecret}
                                    onChange={(e) => setConfig({ ...config, stripeParams: { ...config.stripeParams, webhookSecret: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* MAINTENANCE MODE */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-xl border border-red-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Danger Zone</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <span className="block font-medium text-gray-900">Maintenance Mode</span>
                                <span className="text-sm text-gray-500">Disable access for all non-admin users.</span>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${config.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
