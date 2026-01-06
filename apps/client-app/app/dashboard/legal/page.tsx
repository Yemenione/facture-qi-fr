"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Scale, FileText, Lock } from "lucide-react"

export default function LegalPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Scale className="h-8 w-8 text-slate-700" />
                    Mentions Légales & Conformité
                </h1>
                <p className="text-slate-500">
                    Consultez les documents légaux régissant l'utilisation de la plateforme.
                </p>
            </div>

            <Tabs defaultValue="terms" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="terms" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                        <FileText className="w-4 h-4 mr-2" /> CGU / CGV
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                        <Lock className="w-4 h-4 mr-2" /> Confidentialité
                    </TabsTrigger>
                    <TabsTrigger value="gdpr" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                        <Shield className="w-4 h-4 mr-2" /> RGPD & Sécurité
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="terms">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conditions Générales d'Utilisation (CGU)</CardTitle>
                            <CardDescription>Dernière mise à jour : 01 Janvier 2026</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-slate-50 text-sm text-slate-700 leading-relaxed">
                                <h3 className="font-bold text-slate-900 mb-2">1. Objet</h3>
                                <p className="mb-4">Les présentes Conditions Générales ont pour objet de définir les modalités de mise à disposition des services du site...</p>

                                <h3 className="font-bold text-slate-900 mb-2">2. Mentions Légales</h3>
                                <p className="mb-4">L'édition du site est assurée par la Société [VOTRE SOCIÉTÉ], SAS au capital de 1000 euros...</p>

                                <h3 className="font-bold text-slate-900 mb-2">3. Accès au service</h3>
                                <p className="mb-4">Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet...</p>

                                <h3 className="font-bold text-slate-900 mb-2">4. Propriété intellectuelle</h3>
                                <p className="mb-4">Les marques, logos, signes ainsi que tout le contenu du site (textes, images, son...) font l'objet d'une protection par le Code de la propriété intellectuelle...</p>

                                <p className="italic text-slate-400 mt-8 text-xs text-center border-t pt-4">Ceci est un document exemple. Veuillez consulter votre avocat pour rédiger vos véritables CGU.</p>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Politique de Confidentialité</CardTitle>
                            <CardDescription>Comment nous traitons vos données personnelles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-slate-50 text-sm text-slate-700 leading-relaxed">
                                <h3 className="font-bold text-slate-900 mb-2">1. Collecte des données</h3>
                                <p className="mb-4">Nous collectons les informations suivantes : Nom, Prénom, Adresse email, Données de facturation...</p>

                                <h3 className="font-bold text-slate-900 mb-2">2. Utilisation des données</h3>
                                <p className="mb-4">Les données collectées sont utilisées pour la gestion de votre compte, le support client, et l'envoi d'informations sur nos services...</p>

                                <h3 className="font-bold text-slate-900 mb-2">3. Partage avec des tiers</h3>
                                <p className="mb-4">Nous ne vendons pas vos données. Elles peuvent être partagées avec nos sous-traitants (hébergement, paiement) dans la stricte limite nécessaire à l'exécution du service...</p>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gdpr">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conformité RGPD</CardTitle>
                            <CardDescription>Vos droits et notre engagement pour la sécurité.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                                    <Shield className="h-5 w-5" /> Délégué à la Protection des Données (DPO)
                                </h4>
                                <p className="text-sm text-blue-800">
                                    Pour toute question relative à vos données personnelles, vous pouvez contacter notre DPO à l'adresse : <span className="font-mono bg-blue-100 px-1 rounded">dpo@example.com</span>
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Droit d'accès</h4>
                                    <p className="text-sm text-slate-600">Vous pouvez demander une copie de toutes vos données stockées dans notre système.</p>
                                </div>
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Droit à l'oubli</h4>
                                    <p className="text-sm text-slate-600">Vous pouvez demander la suppression définitive de votre compte et de vos données.</p>
                                </div>
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Portabilité</h4>
                                    <p className="text-sm text-slate-600">Vous pouvez exporter vos données (FEC, JSON) à tout moment depuis votre espace.</p>
                                </div>
                                <div className="border p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Sécurité</h4>
                                    <p className="text-sm text-slate-600">Toutes les données sont chiffrées au repos et en transit (TLS 1.3).</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
