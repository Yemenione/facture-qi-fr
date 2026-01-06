import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { useToast } from '../components/providers/toast-provider';
import { ShieldCheck, CheckCircle, XCircle, FileText, Building2, ExternalLink } from 'lucide-react';

export default function VerificationCenter() {
    const [pending, setPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        try {
            const data = await adminService.getPendingVerifications();
            setPending(data);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load pending verifications");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, name: string) => {
        try {
            await adminService.approveVerification(id);
            toast.success("Approved", `Company ${name} has been verified.`);
            loadPending();
        } catch (err) {
            toast.error("Error", "Failed to approve company");
        }
    };

    const handleReject = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to REJECT ${name}? Owners will be notified.`)) return;
        try {
            await adminService.rejectVerification(id);
            toast.success("Rejected", `Company ${name} verification rejected.`);
            loadPending();
        } catch (err) {
            toast.error("Error", "Failed to reject company");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <ShieldCheck className="w-6 h-6 mr-2 text-indigo-600" />
                            Verification Center (KYC)
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Review and approve company documents before they can issue invoices.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading queue...</div>
                ) : pending.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No pending verify requests at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {pending.map((company) => (
                            <div key={company.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <Building2 className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                <span>SIREN: <span className="font-mono">{company.siren}</span></span>
                                                <span>•</span>
                                                <span>Owner: {company.users?.[0]?.firstName} {company.users?.[0]?.lastName} ({company.users?.[0]?.email})</span>
                                            </div>

                                            {/* Documents Section Mock */}
                                            <div className="mt-4 flex gap-3">
                                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded border text-sm text-indigo-600 cursor-pointer hover:bg-gray-100 transition">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View KBIS (PDF)
                                                    <ExternalLink className="w-3 h-3 ml-2" />
                                                </div>
                                                <div className="flex items-center px-3 py-2 bg-gray-50 rounded border text-sm text-indigo-600 cursor-pointer hover:bg-gray-100 transition">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View ID Card (JPG)
                                                    <ExternalLink className="w-3 h-3 ml-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleApprove(company.id, company.name)}
                                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(company.id, company.name)}
                                            className="flex items-center justify-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
