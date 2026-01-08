"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/providers/toast-provider"
import { Terminal, Copy, RefreshCw, ExternalLink, Key, ShieldAlert, Trash2, Plus } from "lucide-react"
import { getCookie } from "cookies-next"

export default function DevelopersPage() {
    const toast = useToast()
    const [keys, setKeys] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newKey, setNewKey] = useState<string | null>(null)

    useEffect(() => {
        loadKeys()
    }, [])

    const loadKeys = async () => {
        try {
            const token = getCookie('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setKeys(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateKey = async () => {
        setLoading(true)
        try {
            const token = getCookie('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: `Key ${new Date().toLocaleDateString()}` })
            })

            if (res.ok) {
                const data = await res.json()
                setNewKey(data.secretKey)
                setKeys([...keys, data])
                toast.success("Clé API créée", "Copiez-la maintenant, elle ne sera plus affichée.")
            }
        } catch (e) {
            toast.error("Erreur", "Impossible de créer la clé")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteKey = async (id: string) => {
        if (!confirm("Voulez-vous révoquer cette clé ?")) return
        try {
            const token = getCookie('token')
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            setKeys(keys.filter(k => k.id !== id))
            toast.success("Clé révoquée", "L'accès via cette clé est désactivé.")
        } catch (e) {
            toast.error("Erreur", "Impossible de supprimer la clé")
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copié !", "Dans le presse-papier.")
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Terminal className="h-8 w-8 text-brand-gold" />
                    Espace Développeurs
                </h1>
                <p className="text-zinc-400">
                    Générez des clés API pour connecter **Make**, **n8n**, ou vos propres scripts.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

                {/* API Key Management */}
                <div className="space-y-6">
                    <Card className="border-white/10 bg-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-brand-gold" /> Mes Clés API
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Gérez vos accès externes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {newKey && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                                    <p className="text-sm font-bold text-green-400 mb-2">Nouvelle Clé (Copiez-la maintenant !)</p>
                                    <div className="flex gap-2">
                                        <Input value={newKey} readOnly className="font-mono bg-black/20 border-green-500/30 text-green-300" />
                                        <Button variant="outline" size="icon" onClick={() => handleCopy(newKey)} className="border-green-500/30 hover:bg-green-500/20 text-green-400">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-green-500/80 mt-2">Pour des raisons de sécurité, elle ne sera plus affichée.</p>
                                </div>
                            )}

                            {keys.map(key => (
                                <div key={key.id} className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded">
                                            <Key className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{key.name}</div>
                                            <div className="text-xs font-mono text-zinc-500">{key.prefix}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteKey(key.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {keys.length === 0 && !newKey && (
                                <div className="text-center py-8 text-zinc-500 text-sm">
                                    Aucune clé active.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="justify-between border-t border-white/10 bg-white/5 p-4">
                            <span className="text-xs text-slate-500">Limite: 5 clés actives</span>
                            <Button size="sm" onClick={handleCreateKey} disabled={loading || keys.length >= 5}>
                                <Plus className="w-4 h-4 mr-2" />
                                Créer une clé
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 text-sm text-yellow-500">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        <p>Ne partagez jamais vos clés API. Si une clé est compromise, révoquez-la immédiatement.</p>
                    </div>
                </div>

                {/* Documentation */}
                <div className="space-y-6">
                    <Card className="bg-white/5 border-white/10 text-white">
                        <CardHeader>
                            <CardTitle>Documentation Rapide</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-zinc-300">Authentification</h3>
                                <p className="text-xs text-zinc-500">Ajoutez ce header à vos requêtes :</p>
                                <code className="block bg-black/50 text-zinc-300 border border-white/10 p-3 rounded-lg text-xs font-mono">
                                    Authorization: Bearer sk_live_...
                                </code>
                            </div>

                            <a href="#" className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-md font-bold text-blue-400 text-xs">DOCS</div>
                                    <div>
                                        <div className="font-semibold group-hover:text-blue-400 transition-colors">Documentation API</div>
                                        <div className="text-sm text-zinc-500">Endpoints pour Invoices, Clients, etc.</div>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-zinc-500" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
