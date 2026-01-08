import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-brand-dark py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Brand */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-tight">Invoicer FR</span>
                    <span className="text-zinc-500 text-xs">© 2026. Fait avec passion à Paris.</span>
                </div>

                {/* Links */}
                <nav className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
                    <Link href="/docs" className="hover:text-brand-gold transition-colors">Documentation</Link>
                    <Link href="/#pricing" className="hover:text-brand-gold transition-colors">Tarifs</Link>
                    <Link href="/legal/privacy" className="hover:text-brand-gold transition-colors">Mentions Légales</Link>
                    <Link href="/login" className="hover:text-brand-gold transition-colors">Espace Client</Link>
                </nav>

                {/* Socials */}
                <div className="flex gap-4 text-zinc-400">
                    <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></Link>
                </div>

            </div>
        </footer>
    )
}
