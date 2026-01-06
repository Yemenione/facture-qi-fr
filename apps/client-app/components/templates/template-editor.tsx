"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Save, Loader2, Layout, Type, Palette as PaletteIcon, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

import InvoiceRenderer from "./invoice-renderer"
import templateService from "@/services/template.service"
import { useToast } from "@/providers/toast-provider"

// Mock data for preview
const PREVIEW_DATA = {
    invoiceNumber: "2026-F1024",
    issueDate: "05/01/2026",
    dueDate: "05/02/2026",
    companyName: "Ma Société SAS",
    companyAddress: "123 Avenue des Champs-Élysées, 75008 Paris",
    companyEmail: "contact@masociete.com",
    companyPhone: "+33 1 23 45 67 89",
    clientName: "Client Exemple",
    clientAddress: "45 Rue de la République, 69002 Lyon",
    clientEmail: "jean.dupont@client.com",
    items: [
        { description: "Développement Site Web", quantity: 1, unitPrice: 1500 },
        { description: "Hébergement (1 an)", quantity: 1, unitPrice: 240 },
        { description: "Maintenance mensuelle", quantity: 6, unitPrice: 80 },
    ],
    subTotal: 2220,
    vatAmount: 444,
    total: 2664
}

interface TemplateEditorProps {
    initialData?: any;
    isEditing?: boolean;
}

// Presets Configuration
const PRESETS = [
    {
        id: 'modern',
        label: 'Moderne',
        description: 'Style audacieux avec bannière',
        values: {
            fontFamily: 'Inter',
            headerStyle: 'BANNER',
            primaryColor: '#4F46E5',
            secondaryColor: '#818CF8',
            textColor: '#1F2937',
            backgroundColor: '#FFFFFF',
            logoPosition: 'LEFT'
        }
    },
    {
        id: 'classic',
        label: 'Classique',
        description: 'Élégant et traditionnel',
        values: {
            fontFamily: 'Times New Roman',
            headerStyle: 'DETAILED',
            primaryColor: '#334155',
            secondaryColor: '#94a3b8',
            textColor: '#0f172a',
            backgroundColor: '#f8fafc',
            logoPosition: 'RIGHT'
        }
    },
    {
        id: 'minimal',
        label: 'Épuré',
        description: 'Simple et efficace',
        values: {
            fontFamily: 'Courier New',
            headerStyle: 'MINIMAL',
            primaryColor: '#000000',
            secondaryColor: '#666666',
            textColor: '#000000',
            backgroundColor: '#FFFFFF',
            logoPosition: 'CENTER'
        }
    },
    {
        id: 'enterprise',
        label: 'Entreprise',
        description: 'Professionnel et sérieux',
        values: {
            fontFamily: 'Arial',
            headerStyle: 'DETAILED',
            primaryColor: '#0f172a',
            secondaryColor: '#ca8a04',
            textColor: '#1e293b',
            backgroundColor: '#FFFFFF',
            logoPosition: 'LEFT'
        }
    }
]

export default function TemplateEditor({ initialData, isEditing = false }: TemplateEditorProps) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("presets") // Default to presets for new templates

    const toast = useToast()
    const { register, handleSubmit, watch, setValue, control, reset } = useForm({
        defaultValues: initialData || {
            name: "Nouveau Modèle",
            type: "CLASSIC",
            isDefault: false,
            // ...
            primaryColor: "#4F46E5",
            secondaryColor: "#818CF8",
            textColor: "#1F2937",
            backgroundColor: "#FFFFFF",
            fontFamily: "Inter",
            headerStyle: 'DETAILED',
            logoPosition: 'LEFT',
            logoWidth: 150,
            showFooter: true,
            legalMentions: "SAS au capital de 1000€ - SIRET 12345678900012 - RCS Paris",
            paymentTermsText: "Paiement à réception de facture, sans escompte.",
            footerText: "Merci de votre confiance !"
        }
    })

    // Watch all fields for live preview
    const formValues = watch()

    const applyPreset = (preset: any) => {
        Object.keys(preset.values).forEach((key) => {
            setValue(key as any, preset.values[key], { shouldDirty: true })
        });
        // Also update name if it's "Nouveau Modèle"
        if (formValues.name === "Nouveau Modèle") {
            setValue("name", `Modèle ${preset.label}`)
        }
        toast.info("Préréglage appliqué", `Le style "${preset.label}" a été chargé.`)
    }

    const onSubmit = async (data: any) => {
        setSaving(true)
        try {
            if (isEditing && initialData?.id) {
                await templateService.update(initialData.id, data)
            } else {
                await templateService.create(data)
            }
            toast.success("Modèle enregistré", "Votre modèle a été sauvegardé avec succès.")
            router.push('/dashboard/settings/templates')
            router.refresh()
        } catch (error) {
            console.error("Failed to save template", error)
            toast.error("Erreur de sauvegarde", "Une erreur est survenue lors de l'enregistrement.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] -m-8 overflow-hidden">
            {/* LEFT SIDEBAR: CONTROLS */}
            <div className="w-1/3 min-w-[400px] border-r bg-white h-full flex flex-col overflow-y-auto">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                        {/* ... Header inputs ... */}
                        <Input
                            {...register("name")}
                            className="text-lg font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-gray-400"
                            placeholder="Nom du modèle..."
                        />
                        <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
                            {saving && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-8 pb-20">
                    <Tabs defaultValue="presets" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 mb-8">
                            <TabsTrigger value="presets"><Layout className="w-4 h-4 mr-2" /> Modèles</TabsTrigger>
                            <TabsTrigger value="design"><PaletteIcon className="w-4 h-4 mr-2" /> Design</TabsTrigger>
                            <TabsTrigger value="layout"><Layout className="w-4 h-4 mr-2" /> Page</TabsTrigger>
                            <TabsTrigger value="content"><Type className="w-4 h-4 mr-2" /> Textes</TabsTrigger>
                        </TabsList>

                        {/* PRESETS TAB */}
                        <TabsContent value="presets" className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {PRESETS.map(preset => (
                                    <Card key={preset.id} className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => applyPreset(preset)}>
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-md border shadow-sm flex-shrink-0" style={{ background: preset.values.primaryColor }}></div>
                                            <div>
                                                <h4 className="font-semibold">{preset.label}</h4>
                                                <p className="text-xs text-gray-500">{preset.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* DESIGN TAB */}
                        <TabsContent value="design" className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">Couleurs</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Principale</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" {...register("primaryColor")} className="w-12 p-1 h-10" />
                                            <Input {...register("primaryColor")} className="uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondaire</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" {...register("secondaryColor")} className="w-12 p-1 h-10" />
                                            <Input {...register("secondaryColor")} className="uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Texte</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" {...register("textColor")} className="w-12 p-1 h-10" />
                                            <Input {...register("textColor")} className="uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fond</Label>
                                        <div className="flex gap-2">
                                            <Input type="color" {...register("backgroundColor")} className="w-12 p-1 h-10" />
                                            <Input {...register("backgroundColor")} className="uppercase" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">Typographie</h3>
                                <div className="space-y-2">
                                    <Label>Police</Label>
                                    <Select
                                        value={formValues.fontFamily}
                                        onValueChange={(val) => setValue("fontFamily", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir une police" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Inter">Inter (Sans-serif)</SelectItem>
                                            <SelectItem value="Times New Roman">Times New Roman (Serif)</SelectItem>
                                            <SelectItem value="Arial">Arial</SelectItem>
                                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                                            <SelectItem value="Courier New">Courier New (Monospace)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        {/* LAYOUT TAB */}
                        <TabsContent value="layout" className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">En-tête</h3>
                                <div className="space-y-2">
                                    <Label>Style d'en-tête</Label>
                                    <Select
                                        value={formValues.headerStyle}
                                        onValueChange={(val) => setValue("headerStyle", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MINIMAL">Minimal</SelectItem>
                                            <SelectItem value="DETAILED">Détaillé</SelectItem>
                                            <SelectItem value="BANNER">Bannière colorée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">Logo</h3>
                                <div className="space-y-2">
                                    <Label>URL du Logo</Label>
                                    <Input {...register("logoUrl")} placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Select
                                        value={formValues.logoPosition}
                                        onValueChange={(val) => setValue("logoPosition", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LEFT">Gauche</SelectItem>
                                            <SelectItem value="CENTER">Centre</SelectItem>
                                            <SelectItem value="RIGHT">Droite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Taille (px): {watch("logoWidth")}</Label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="400"
                                        step="10"
                                        className="w-full"
                                        {...register("logoWidth", { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* CONTENT TAB */}
                        <TabsContent value="content" className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">Pied de page</h3>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="showFooter"
                                        checked={watch("showFooter")}
                                        onCheckedChange={(val) => setValue("showFooter", val)}
                                    />
                                    <Label htmlFor="showFooter">Afficher le pied de page</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label>Texte personnalisé (ex: Remerciements)</Label>
                                    <Input {...register("footerText")} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase">Mentions Légales & Paiement</h3>
                                <div className="space-y-2">
                                    <Label>Mentions Légales Document</Label>
                                    <textarea
                                        {...register("legalMentions")}
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Conditions de Paiement</Label>
                                    <Input {...register("paymentTermsText")} />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* RIGHT SIDEBAR: PREVIEW */}
            <div className="flex-1 bg-slate-100 h-full p-8 overflow-y-auto flex justify-center">
                <div className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl transition-all duration-300 origin-top scale-[0.85] md:scale-100">
                    <InvoiceRenderer template={formValues} data={PREVIEW_DATA} />
                </div>
            </div>
        </div>
    )
}
