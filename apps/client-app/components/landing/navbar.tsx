"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { LogOut, LayoutDashboard, Menu, X, ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsLoggedIn(authService.isAuthenticated())
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        authService.logout()
        setIsLoggedIn(false)
        router.refresh()
        router.push("/")
    }

    return (
        <header
            className={cn(
                "fixed top-4 left-0 right-0 z-50 transition-all duration-300 mx-auto max-w-5xl",
                scrolled ? "px-4" : "px-6"
            )}
        >
            <div className={cn(
                "flex items-center justify-between rounded-full border border-white/10 px-6 py-3 transition-all duration-300",
                scrolled
                    ? "bg-brand-dark/80 backdrop-blur-md shadow-2xl ring-1 ring-white/10"
                    : "bg-transparent"
            )}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-gold to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-brand-gold/20 transition-all duration-300">
                        I
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight text-white group-hover:text-brand-gold transition-colors">
                        Invoicer FR
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {/* Solutions Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors py-2">
                            Solutions <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-1">
                            <div className="bg-brand-dark border border-white/10 rounded-xl shadow-xl overflow-hidden p-1">
                                <Link href="/solutions/freelances" className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    Pour Freelances
                                </Link>
                                <Link href="/solutions/pme" className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    Pour PME
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/docs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Documentation</Link>
                    <Link href="/#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Tarifs</Link>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard">
                                <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm rounded-full px-4">
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-zinc-400 hover:text-white rounded-full h-8 w-8"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                                Connexion
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold rounded-full px-6 shadow-lg shadow-brand-gold/20 group">
                                    Commencer
                                    <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-zinc-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-20 left-4 right-4 bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="space-y-2 pb-2 border-b border-white/5">
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">Solutions</p>
                                <Link href="/solutions/freelances" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1 text-zinc-300 hover:text-white">Freelances</Link>
                                <Link href="/solutions/pme" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1 text-zinc-300 hover:text-white">PME & TPE</Link>
                            </div>

                            <Link
                                href="/docs"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-zinc-300 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Documentation
                            </Link>
                            <Link
                                href="/#pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-zinc-300 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Tarifs
                            </Link>

                            <div className="h-px bg-white/10 my-2" />
                            {isLoggedIn ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-brand-blue">Dashboard</Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full text-red-400" onClick={handleLogout}>Déconnexion</Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">Connexion</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-brand-gold text-brand-dark font-bold">S'inscrire</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
