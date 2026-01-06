"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Check, Trash2, Pencil, Palette, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import templateService, { InvoiceTemplate } from "@/services/template.service"

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadTemplates()
    }, [])

    const loadTemplates = async () => {
        try {
            const data = await templateService.findAll()
            setTemplates(data)
        } catch (error) {
            console.error("Failed to load templates", error)
        } finally {
            setLoading(false)
        }
    }

    const setAsDefault = async (id: string) => {
        try {
            await templateService.setDefault(id)
            // Refresh local state to show new default
            loadTemplates()
        } catch (error) {
            console.error(error)
            alert("Erreur lors de la mise à jour")
        }
    }

    const deleteTemplate = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce modèle ?")) return;
        try {
            await templateService.delete(id)
            loadTemplates()
        } catch (error) {
            console.error(error)
            alert("Impossible de supprimer ce modèle (peut-être est-il le seul ?)")
        }
    }

    if (loading) return <div className="p-8">Chargement...</div>

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20 p-2">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Modèles de Facture</h1>
                    <p className="text-slate-500">Personnalisez l'apparence de vos documents.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/settings/templates/new">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Modèle
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className={`group relative overflow-hidden transition-all ${template.isDefault ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'}`}>
                        {template.isDefault && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-white" /> Par défaut
                            </div>
                        )}

                        <div className="h-32 bg-slate-50 border-b flex items-center justify-center p-4">
                            {/* Mini Preview Placeholder */}
                            <div className="w-full h-full bg-white shadow-sm border p-2 flex flex-col gap-2 scale-90 opacity-75">
                                <div className="h-2 w-1/3 rounded" style={{ backgroundColor: template.primaryColor }}></div>
                                <div className="space-y-1">
                                    <div className="h-1 w-full bg-slate-100 rounded"></div>
                                    <div className="h-1 w-2/3 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center justify-between">
                                {template.name}
                            </CardTitle>
                            <CardDescription className="capitalize text-xs">
                                Style: {template.type.toLowerCase()}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-2">
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: template.primaryColor }} title="Couleur Principale"></div>
                                <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: template.secondaryColor }} title="Couleur Secondaire"></div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2 pt-2">
                            {!template.isDefault && (
                                <Button variant="outline" size="sm" onClick={() => setAsDefault(template.id)} className="text-xs">
                                    <Check className="h-3 w-3 mr-1" /> Définir par défaut
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/settings/templates/${template.id}`}>
                                    <Pencil className="h-4 w-4 text-slate-400 hover:text-blue-600" />
                                </Link>
                            </Button>
                            {!template.isDefault && (
                                <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
