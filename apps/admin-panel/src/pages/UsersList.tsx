import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import { Search, Mail, ShieldAlert, BadgeCheck, Edit } from 'lucide-react';
import { useToast } from '../components/providers/toast-provider';

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [term, setTerm] = useState('');
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const toast = useToast();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            // Fetch users from a dedicated /admin/users endpoint
            const allUsers = await adminService.getUsers();
            // Transform if needed to match UI Expectations
            const mappedUsers = allUsers.map((u: any) => ({
                ...u,
                companyName: u.company?.name || 'Unknown'
            }));
            setUsers(mappedUsers);
        } catch (err) {
            console.error(err);
            toast.error("Error", "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.email?.toLowerCase().includes(term.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(term.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(term.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Company</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-6 text-center">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center">No users found.</td></tr>
                            ) : (
                                filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                                    {user.firstName?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <Mail className="w-3 h-3 mr-1" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-700">{user.companyName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center text-green-600 text-xs font-medium">
                                                <BadgeCheck className="w-3 h-3 mr-1" /> Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setEditForm({
                                                        firstName: user.firstName,
                                                        lastName: user.lastName,
                                                        email: user.email,
                                                        password: ''
                                                    });
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 transition p-1"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Are you certain you want to delete this user? This action is irreversible.')) {
                                                        await adminService.deleteUser(user.id);
                                                        toast.success("User Deleted", "User removed permanently");
                                                        loadUsers();
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-red-600 transition p-1"
                                                title="Delete User"
                                            >
                                                <ShieldAlert className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Edit Modal - Simplistic implementation */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                            <h2 className="text-lg font-bold mb-4">Edit User: {editingUser.firstName}</h2>
                            <div className="space-y-3">
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="First Name"
                                    value={editForm.firstName}
                                    onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                />
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="Last Name"
                                    value={editForm.lastName}
                                    onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                />
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="New Password (leave blank to keep)"
                                    type="password"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await adminService.updateUser(editingUser.id, editForm);
                                            toast.success("Success", "User updated successfully");
                                            setEditingUser(null);
                                            loadUsers();
                                        } catch (e) {
                                            toast.error("Error", "Failed to update user");
                                        }
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
