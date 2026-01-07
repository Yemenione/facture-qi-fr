import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h2 className="text-9xl font-extrabold text-slate-200">404</h2>
            <h1 className="text-3xl font-bold text-slate-900 mt-4">Page introuvable</h1>
            <p className="text-slate-500 mt-2 max-w-md">
                Désolé, la page que vous recherchez semble introuvable. Elle a peut-être été déplacée ou supprimée.
            </p>
            <Button asChild className="mt-8 bg-slate-900 text-white hover:bg-slate-800" size="lg">
                <Link href="/dashboard">
                    Retour au tableau de bord
                </Link>
            </Button>
        </div>
    )
}
