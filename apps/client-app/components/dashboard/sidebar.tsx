"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    Settings,
    LogOut,
    FileClock,
    FileWarning,
    Calculator,
    MailWarning,
    Terminal,
    LifeBuoy,
    Scale,
    CreditCard,
    UploadCloud
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        router.refresh()
        router.push("/")
    }

    const routes = [
        {
            label: "Tableau de bord",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Dépôt Rapide",
            icon: UploadCloud,
            href: "/dashboard/documents/upload",
            active: pathname?.startsWith("/dashboard/documents/upload"),
        },
        {
            label: "Factures",
            icon: FileText,
            href: "/dashboard/invoices",
            active: pathname?.startsWith("/dashboard/invoices"),
        },
        {
            label: "Devis",
            icon: FileClock,
            href: "/dashboard/quotes",
            active: pathname?.startsWith("/dashboard/quotes"),
        },
        {
            label: "Avoirs",
            icon: FileWarning,
            href: "/dashboard/credit-notes",
            active: pathname?.startsWith("/dashboard/credit-notes"),
        },
        {
            label: "Relances",
            icon: MailWarning,
            href: "/dashboard/dunning",
            active: pathname?.startsWith("/dashboard/dunning"),
        },
        {
            label: "Clients",
            icon: Users,
            href: "/dashboard/clients",
            active: pathname?.startsWith("/dashboard/clients"),
        },
        {
            label: "Produits",
            icon: Package,
            href: "/dashboard/products",
            active: pathname?.startsWith("/dashboard/products"),
        },
        {
            label: "Dépenses",
            icon: CreditCard,
            href: "/dashboard/expenses",
            active: pathname?.startsWith("/dashboard/expenses"),
        },
        {
            label: "Comptabilité",
            icon: Calculator,
            href: "/dashboard/accounting",
            active: pathname?.startsWith("/dashboard/accounting"),
        },
        {
            label: "Paramètres",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname?.startsWith("/dashboard/settings"),
        },
        {
            label: "Abonnement",
            icon: CreditCard,
            href: "/dashboard/subscription",
            active: pathname?.startsWith("/dashboard/subscription"),
        },
    ]

    const helpRoutes = [
        {
            label: "API Développeurs",
            icon: Terminal,
            href: "/dashboard/developers",
            active: pathname?.startsWith("/dashboard/developers"),
        },
        {
            label: "Centre de Support",
            icon: LifeBuoy,
            href: "/dashboard/support",
            active: pathname?.startsWith("/dashboard/support"),
        },
        {
            label: "Mentions Légales",
            icon: Scale,
            href: "/dashboard/legal",
            active: pathname?.startsWith("/dashboard/legal"),
        },
    ]

    return (
        <div className={cn("flex flex-col h-full bg-slate-50/50 border-r border-slate-200", className)}>
            <div className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-slate-900">
                        Mon SaaS
                    </h2>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    route.active ? "bg-slate-200/60 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("mr-2 h-4 w-4", route.active && "text-slate-900")} />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight text-slate-500">
                        Aide & Outils
                    </h2>
                    <div className="space-y-1">
                        {helpRoutes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    route.active ? "bg-slate-200/60 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("mr-2 h-4 w-4", route.active && "text-slate-900")} />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    )
}
