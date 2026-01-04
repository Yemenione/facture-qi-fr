import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { Building2, Users, FileText, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await adminService.getCompanies();
            setCompanies(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalCompanies = companies.length;
    const totalInvoices = companies.reduce((acc, curr) => acc + (curr.invoicesCount || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                    <button
                        onClick={adminService.logout}
                        className="flex items-center text-gray-600 hover:text-red-600 transition"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Entreprises</p>
                            <p className="text-2xl font-bold">{totalCompanies}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                            <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Factures</p>
                            <p className="text-2xl font-bold">{totalInvoices}</p>
                        </div>
                    </div>
                </div>

                {/* Companies List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Entreprises Inscrites</h2>
                        <Link to="/companies" className="text-blue-600 hover:underline text-sm">Voir tout</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Nom</th>
                                    <th className="px-6 py-3 font-medium">Email Contact</th>
                                    <th className="px-6 py-3 font-medium">Plan</th>
                                    <th className="px-6 py-3 font-medium">Utilisateurs</th>
                                    <th className="px-6 py-3 font-medium">Factures</th>
                                    <th className="px-6 py-3 font-medium">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-6 text-center text-gray-500">Chargement...</td></tr>
                                ) : companies.length === 0 ? (
                                    <tr><td colSpan="6" className="p-6 text-center text-gray-500">Aucune entreprise trouvée.</td></tr>
                                ) : (
                                    companies.map((company: any) => (
                                        <tr key={company.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">{company.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{company.email || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                    Freemium
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{company.usersCount}</td>
                                            <td className="px-6 py-4 text-gray-500">{company.invoicesCount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${company.subscriptionStatus === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {company.subscriptionStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
