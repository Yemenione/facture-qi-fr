"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Palette, Trash2, Star, Edit } from "lucide-react"
import Link from "next/link"

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            setTemplates(data)
        } catch (error) {
            console.error('Failed to load templates', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            fetchTemplates()
        } catch (error) {
            console.error('Failed to delete template', error)
        }
    }

    const handleSetDefault = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}/set-default`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            fetchTemplates()
        } catch (error) {
            console.error('Failed to set default', error)
        }
    }

    const getTypeLabel = (type: string) => {
        const labels: any = {
            CLASSIC: 'Classique',
            MODERN: 'Moderne',
            ELEGANT: 'Élégant',
            COLORFUL: 'Coloré'
        }
        return labels[type] || type
    }

    if (loading) return <div className="p-8">Chargement...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Templates de factures</h1>
                    <p className="text-muted-foreground">Personnalisez l'apparence de vos factures</p>
                </div>
                <Link href="/dashboard/settings/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau template
                    </Button>
                </Link>
            </div>

            {templates.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun template</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Créez votre premier template personnalisé
                        </p>
                        <Link href="/dashboard/settings/templates/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Créer un template
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <Card key={template.id} className="relative group hover:shadow-lg transition-shadow">
                            {template.isDefault && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current" />
                                        Par défaut
                                    </div>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border-2"
                                        style={{ backgroundColor: template.primaryColor }}
                                    />
                                    {template.name}
                                </CardTitle>
                                <CardDescription>{getTypeLabel(template.type)}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    {/* Color Preview */}
                                    <div className="flex gap-2">
                                        <div
                                            className="w-8 h-8 rounded border"
                                            style={{ backgroundColor: template.primaryColor }}
                                            title="Couleur primaire"
                                        />
                                        <div
                                            className="w-8 h-8 rounded border"
                                            style={{ backgroundColor: template.secondaryColor }}
                                            title="Couleur secondaire"
                                        />
                                        <div
                                            className="w-8 h-8 rounded border"
                                            style={{ backgroundColor: template.textColor }}
                                            title="Couleur du texte"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/settings/templates/${template.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="mr-2 h-3 w-3" />
                                                Modifier
                                            </Button>
                                        </Link>
                                        {!template.isDefault && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(template.id)}
                                            >
                                                <Star className="h-3 w-3" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(template.id)}
                                            disabled={template.isDefault}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
