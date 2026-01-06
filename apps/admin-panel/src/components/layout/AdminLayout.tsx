import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    Settings,
    Activity,
    LogOut,
    Menu,
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    Shield
} from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { CommandPalette } from '../CommandPalette';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, path, active, subItems }: any) => {
    const [expanded, setExpanded] = useState(false);

    if (subItems) {
        return (
            <div className="mb-1">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                    <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {label}
                    </div>
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-9 space-y-1 mt-1"
                        >
                            {subItems.map((sub: any) => (
                                <Link
                                    key={sub.path}
                                    to={sub.path}
                                    className="block px-3 py-1.5 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            to={path}
            className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                active ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
            )}
        >
            <Icon className="w-5 h-5 mr-3" />
            {label}
        </Link>
    );
};

export default function AdminLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Command Palette Globally Available */}
            <CommandPalette />

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Shield className="w-6 h-6" />
                        <span className="font-bold text-lg">AdminOS</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">
                        <div>
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
                            <SidebarItem
                                icon={LayoutDashboard}
                                label="Dashboard"
                                path="/"
                                active={location.pathname === '/'}
                            />
                            <SidebarItem
                                icon={Building2}
                                label="Companies"
                                path="/companies"
                                active={location.pathname.startsWith('/companies')}
                            />
                            <SidebarItem
                                icon={CreditCard}
                                label="Subscriptions"
                                path="/subscriptions"
                                active={location.pathname.startsWith('/subscriptions')}
                            />
                        </div>

                        <div>
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System</p>
                            <SidebarItem
                                icon={Activity}
                                label="Activity Logs"
                                path="/activity"
                                active={location.pathname === '/activity'}
                            />
                            <SidebarItem
                                icon={Settings}
                                label="Settings"
                                active={location.pathname.startsWith('/settings')}
                                subItems={[
                                    { label: 'General', path: '/settings/general' },
                                    { label: 'Subscriptions', path: '/subscriptions' },
                                    { label: 'Users', path: '/users' },
                                    { label: 'Security', path: '/settings/security' },
                                    { label: 'Backups', path: '/settings/backups' },
                                    { label: 'System Health', path: '/status' },
                                    { label: 'Verification (KYC)', path: '/verification' },
                                    { label: 'Support Tickets', path: '/support' },
                                    { label: 'Broadcasts', path: '/broadcasts' },
                                    { label: 'Marketing', path: '/marketing' },
                                    { label: 'Audit Logs', path: '/activity' },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={adminService.logout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 sticky top-0 z-10">
                    <div className="flex items-center text-gray-400">
                        <Menu className="w-5 h-5 md:hidden mr-4 cursor-pointer" />
                        <Search className="w-4 h-4 mr-2" />
                        <span className="text-sm">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs border">Ctrl K</kbd> to search</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                            SA
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
