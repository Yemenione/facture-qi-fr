"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    FileText,
    Users,
    Package,
    Settings,
    LogOut
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { logout } = useAuthStore()

    const routes = [
        {
            label: "Tableau de bord",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Factures",
            icon: FileText,
            href: "/dashboard/invoices",
            active: pathname?.startsWith("/dashboard/invoices"),
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
            label: "Paramètres",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname?.startsWith("/dashboard/settings"),
        },
    ]

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Mon SaaS
                    </h2>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-3 py-2 mt-auto absolute bottom-4 w-full">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    )
}
