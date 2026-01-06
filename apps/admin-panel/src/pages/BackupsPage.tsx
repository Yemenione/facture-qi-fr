import { useState } from 'react';
import { adminService } from '../services/admin.service';
import { useToast } from '../components/providers/toast-provider';
import { Download, Database, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BackupsPage() {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleDownload = async () => {
        setLoading(true);
        try {
            const blob = await adminService.downloadBackup();
            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `system-backup-${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            toast.success("Backup Downloaded", "System data has been exported successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Download Failed", "Unable to generate system backup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">System Backups</h1>
                <p className="text-gray-500 mt-1">Manage database exports and disaster recovery snapshots.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Manual Backup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                        <Database className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Manual Export</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Generate a full JSON dump of Companies, Users, and Invoices.
                        This operation might take a few seconds depending on data size.
                    </p>
                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading ? 'Generating...' : <><Download className="w-4 h-4 mr-2" /> Download Backup</>}
                    </button>
                </motion.div>

                {/* Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col"
                >
                    <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Backup Status</h3>
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                            <span className="text-gray-500">Last Backup</span>
                            <span className="font-medium">Never</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                            <span className="text-gray-500">Auto-Backup</span>
                            <span className="font-medium text-yellow-600">Disabled</span>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                            Automatic S3 backups are not configured. Please check server configuration.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
