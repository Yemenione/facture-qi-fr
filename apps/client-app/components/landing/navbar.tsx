"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react"

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check authentication status on mount
        setIsLoggedIn(authService.isAuthenticated())
    }, [])

    const handleLogout = () => {
        authService.logout()
        setIsLoggedIn(false)
        router.refresh()
        router.push("/")
    }

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Invoicer FR
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Fonctionnalités
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                        Tarifs
                    </Link>

                    <div className="flex items-center gap-4 ml-4">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="default" size="sm" className="gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-muted-foreground hover:text-destructive gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Se déconnecter</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Se connecter</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Commencer</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b bg-background p-4 space-y-4">
                    <Link href="#features" className="block text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Fonctionnalités
                    </Link>
                    <Link href="#pricing" className="block text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                        Tarifs
                    </Link>
                    <div className="pt-4 border-t space-y-2">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full justify-start gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Accéder au Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        handleLogout()
                                        setMobileMenuOpen(false)
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Se déconnecter
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">Se connecter</Button>
                                </Link>
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full justify-start">S'inscrire gratuitement</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
