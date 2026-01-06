"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Users, FileText, Settings, LogOut, Zap, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("accountant_token");
        router.push("/login");
    };

    const navItems = [
        { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
        { href: "/dashboard/clients", label: "Dossiers Clients", icon: Users },
        { href: "/dashboard/automation", label: "Automatisation", icon: Zap },
        { href: "/dashboard/documents", label: "Documents", icon: FileText },
        { href: "/dashboard/settings", label: "Paramètres Cabinet", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">ExpertPortail</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        // Simple active check
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start text-sm font-medium h-11 ${
                                        isActive 
                                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button 
                        variant="ghost" 
                        onClick={handleLogout} 
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
                    <h1 className="font-semibold text-slate-800">
                        {navItems.find(i => i.href === pathname)?.label || "Tableau de bord"}
                    </h1>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white cursor-pointer hover:bg-blue-200 transition-colors">
                             EX
                         </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
