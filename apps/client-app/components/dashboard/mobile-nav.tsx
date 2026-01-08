"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    FileText,
    User,
    Users,
    Menu,
    X,
    UploadCloud,
    FileClock,
    FileWarning,
    MailWarning,
    Package,
    CreditCard,
    Calculator,
    Settings,
    Terminal,
    LifeBuoy,
    Scale,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

export function MobileNav() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        router.refresh()
        router.push("/")
    }

    const mainItems = [
        {
            href: "/dashboard",
            label: "Accueil",
            icon: LayoutDashboard,
            active: pathname === "/dashboard"
        },
        {
            href: "/dashboard/invoices",
            label: "Factures",
            icon: FileText,
            active: pathname.startsWith("/dashboard/invoices")
        },
        {
            href: "/dashboard/clients",
            label: "Clients",
            icon: Users,
            active: pathname.startsWith("/dashboard/clients")
        },
        {
            href: "#",
            label: "Menu",
            icon: Menu,
            active: open,
            onClick: () => setOpen(true)
        }
    ]

    const allRoutes = [
        { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Dépôt Rapide", icon: UploadCloud, href: "/dashboard/documents/upload" },
        { label: "Factures", icon: FileText, href: "/dashboard/invoices" },
        { label: "Devis", icon: FileClock, href: "/dashboard/quotes" },
        { label: "Avoirs", icon: FileWarning, href: "/dashboard/credit-notes" },
        { label: "Relances", icon: MailWarning, href: "/dashboard/dunning" },
        { label: "Clients", icon: Users, href: "/dashboard/clients" },
        { label: "Produits", icon: Package, href: "/dashboard/products" },
        { label: "Dépenses", icon: CreditCard, href: "/dashboard/expenses" },
        { label: "Comptabilité", icon: Calculator, href: "/dashboard/accounting" },
        { label: "Paramètres", icon: Settings, href: "/dashboard/settings" },
        { label: "Abonnement", icon: CreditCard, href: "/dashboard/subscription" },
    ]

    const helpRoutes = [
        { label: "API Développeurs", icon: Terminal, href: "/dashboard/developers" },
        { label: "Centre de Support", icon: LifeBuoy, href: "/dashboard/support" },
        { label: "Mentions Légales", icon: Scale, href: "/dashboard/legal" },
    ]

    return (
        <>
            {/* Full Screen Menu Overlay */}
            {open && (
                <div className="fixed inset-0 z-[60] bg-brand-dark/95 backdrop-blur-xl overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-200">
                    <div className="p-4 space-y-6 pb-24">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-heading font-bold text-white">Menu</h2>
                            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Mon SaaS</h3>
                            {allRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center w-full p-3 rounded-xl transition-all",
                                        pathname === route.href
                                            ? "bg-brand-gold/10 text-brand-gold font-medium border border-brand-gold/20"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <route.icon className={cn("mr-3 h-5 w-5", pathname === route.href ? "text-brand-gold" : "text-zinc-500")} />
                                    {route.label}
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-1 pt-4 border-t border-white/10">
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Aide & Outils</h3>
                            {helpRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center w-full p-3 rounded-xl transition-all",
                                        pathname === route.href
                                            ? "bg-brand-gold/10 text-brand-gold"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <route.icon className={cn("mr-3 h-5 w-5", pathname === route.href ? "text-brand-gold" : "text-zinc-500")} />
                                    {route.label}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 p-3 h-auto"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom md:hidden">
                <div className="flex items-center justify-around h-16 px-2">
                    {mainItems.map((item) => (
                        <div
                            key={item.label}
                            onClick={item.onClick}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all rounded-xl cursor-pointer",
                                item.active ? "text-brand-gold" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {item.onClick ? (
                                <>
                                    <item.icon className={cn("h-5 w-5", item.active && "fill-current")} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </>
                            ) : (
                                <Link href={item.href} className="flex flex-col items-center justify-center w-full h-full">
                                    <item.icon className={cn("h-5 w-5", item.active && "fill-current")} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
        </>
    )
}
