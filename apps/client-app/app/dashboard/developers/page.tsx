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
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Terminal className="h-8 w-8 text-purple-600" />
                    Espace Développeurs
                </h1>
                <p className="text-slate-500">
                    Générez des clés API pour connecter **Make**, **n8n**, ou vos propres scripts.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

                {/* API Key Management */}
                <div className="space-y-6">
                    <Card className="border-purple-200 bg-purple-50/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-purple-600" /> Mes Clés API
                            </CardTitle>
                            <CardDescription>
                                Gérez vos accès externes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {newKey && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm font-bold text-green-800 mb-2">Nouvelle Clé (Copiez-la maintenant !)</p>
                                    <div className="flex gap-2">
                                        <Input value={newKey} readOnly className="font-mono bg-white border-green-200" />
                                        <Button variant="outline" size="icon" onClick={() => handleCopy(newKey)}>
                                            <Copy className="w-4 h-4 text-green-700" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">Pour des raisons de sécurité, elle ne sera plus affichée.</p>
                                </div>
                            )}

                            {keys.map(key => (
                                <div key={key.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded">
                                            <Key className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{key.name}</div>
                                            <div className="text-xs font-mono text-slate-400">{key.prefix}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => handleDeleteKey(key.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {keys.length === 0 && !newKey && (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    Aucune clé active.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="justify-between border-t bg-white/50 p-4">
                            <span className="text-xs text-slate-500">Limite: 5 clés actives</span>
                            <Button size="sm" onClick={handleCreateKey} disabled={loading || keys.length >= 5}>
                                <Plus className="w-4 h-4 mr-2" />
                                Créer une clé
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-sm text-yellow-800">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        <p>Ne partagez jamais vos clés API. Si une clé est compromise, révoquez-la immédiatement.</p>
                    </div>
                </div>

                {/* Documentation */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documentation Rapide</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">Authentification</h3>
                                <p className="text-xs text-slate-500">Ajoutez ce header à vos requêtes :</p>
                                <code className="block bg-slate-900 text-slate-50 p-3 rounded-lg text-xs font-mono">
                                    Authorization: Bearer sk_live_...
                                </code>
                            </div>

                            <a href="#" className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-md font-bold text-blue-700 text-xs">DOCS</div>
                                    <div>
                                        <div className="font-semibold group-hover:text-blue-600 transition-colors">Documentation API</div>
                                        <div className="text-sm text-slate-500">Endpoints pour Invoices, Clients, etc.</div>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
