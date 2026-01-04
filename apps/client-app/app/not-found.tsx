import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold">Page non trouvée</h2>
            <p>Désolé, nous ne trouvons pas la page que vous cherchez.</p>
            <Link href="/dashboard">
                <Button>Retour au tableau de bord</Button>
            </Link>
        </div>
    )
}
