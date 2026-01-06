"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/providers/toast-provider"
import { LifeBuoy, MessageCircle, Phone, Mail, Send, CheckCircle2 } from "lucide-react"

export default function SupportPage() {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setLoading(false)
        setSent(true)
        toast.success("Message envoyé", "Notre équipe vous répondra sous 24h ouvrées.")
    }

    if (sent) {
        return (
            <div className="max-w-xl mx-auto p-8 pt-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Message reçu !</h2>
                <p className="text-slate-600 text-lg">
                    Merci de nous avoir contactés. Un ticket de support a été créé (Ticket #9283).
                    Vous recevrez une confirmation par email.
                </p>
                <Button onClick={() => setSent(false)} variant="outline">Envoyer un autre message</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <LifeBuoy className="h-8 w-8 text-blue-600" />
                    Centre d'Aide & Support
                </h1>
                <p className="text-slate-500">
                    Besoin d'aide ? Consultez notre FAQ ou contactez notre équipe dédiée.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <Card className="border-blue-100 shadow-md">
                        <CardHeader>
                            <CardTitle>Envoyer une demande</CardTitle>
                            <CardDescription>Décrivez votre problème, nous sommes là pour aider.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Prénom</Label>
                                        <Input required placeholder="Jean" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nom</Label>
                                        <Input required placeholder="Dupont" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Sujet</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option>Problème technique</option>
                                        <option>Question sur la facturation</option>
                                        <option>Demande de fonctionnalité</option>
                                        <option>Autre</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea required placeholder="Détaillez votre demande ici..." className="min-h-[150px]" />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 border-t p-4 flex justify-end">
                                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                    {loading ? "Envoi en cours..." : <><Send className="w-4 h-4 mr-2" /> Envoyer le message</>}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Sidebar Info & Mini FAQ */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card className="bg-slate-900 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-white">Contact Direct</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg"><Mail className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">Email</p>
                                    <p className="font-semibold">support@facture-fr.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg"><Phone className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">Téléphone (Urgence)</p>
                                    <p className="font-semibold">+33 1 23 45 67 89</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg"><MessageCircle className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">Chat en direct</p>
                                    <p className="font-semibold">Disponible 9h - 18h</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick FAQ */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Questions Fréquentes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="px-4">
                                    <AccordionTrigger>Comment modifier une facture validée ?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600">
                                        Une facture validée ne peut pas être modifiée (loi anti-fraude). Vous devez créer un Avoir pour l'annuler, puis refaire une facture.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="px-4">
                                    <AccordionTrigger>Comment exporter le fichier FEC ?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600">
                                        Allez dans "Comptabilité" > "Exports" et cliquez sur "Générer FEC".
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3" className="px-4">
                                    <AccordionTrigger>Puis-je changer mon modèle par défaut ?</AccordionTrigger>
                                    <AccordionContent className="text-slate-600">
                                        Oui, dans "Paramètres" > "Modèles de facture", créez ou sélectionnez un modèle et cochez "Définir par défaut".
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
