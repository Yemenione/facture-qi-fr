"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Bell, Shield, Mail, Palette } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [firmName, setFirmName] = useState("Cabinet Expert Comptable");
    const [email, setEmail] = useState("expert@cabinet.fr");
    const [notifications, setNotifications] = useState(true);
    const [autoValidation, setAutoValidation] = useState(false);

    const handleSave = () => {
        toast.success("Paramètres sauvegardés avec succès!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-slate-500 mt-2">
                    Gérez les paramètres de votre cabinet et vos préférences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                    </TabsTrigger>
                    <TabsTrigger value="firm">
                        <Building2 className="h-4 w-4 mr-2" />
                        Cabinet
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="h-4 w-4 mr-2" />
                        Sécurité
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                            <CardDescription>
                                Gérez vos informations de profil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" placeholder="Jean" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" placeholder="Dupont" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
                            </div>
                            <Button onClick={handleSave}>Sauvegarder</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Firm Tab */}
                <TabsContent value="firm">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du cabinet</CardTitle>
                            <CardDescription>
                                Gérez les informations de votre cabinet
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firmName">Nom du cabinet</Label>
                                <Input
                                    id="firmName"
                                    value={firmName}
                                    onChange={(e) => setFirmName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siret">SIRET</Label>
                                <Input id="siret" placeholder="123 456 789 00012" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input id="address" placeholder="123 Rue de la Comptabilité, 75001 Paris" />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ville</Label>
                                    <Input id="city" placeholder="Paris" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">Code postal</Label>
                                    <Input id="zipCode" placeholder="75001" />
                                </div>
                            </div>
                            <Button onClick={handleSave}>Sauvegarder</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Préférences de notification</CardTitle>
                            <CardDescription>
                                Choisissez comment vous souhaitez être notifié
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Notifications par email</Label>
                                    <p className="text-sm text-slate-500">
                                        Recevez des emails pour les événements importants
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Nouveaux documents</Label>
                                    <p className="text-sm text-slate-500">
                                        Notification quand un client télécharge un document
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Échéances TVA</Label>
                                    <p className="text-sm text-slate-500">
                                        Rappel 7 jours avant les échéances TVA
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Validation automatique</Label>
                                    <p className="text-sm text-slate-500">
                                        Valider automatiquement les dépenses \u003c 50€
                                    </p>
                                </div>
                                <Switch
                                    checked={autoValidation}
                                    onCheckedChange={setAutoValidation}
                                />
                            </div>
                            <Button onClick={handleSave}>Sauvegarder</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sécurité</CardTitle>
                            <CardDescription>
                                Gérez la sécurité de votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                            <Button onClick={handleSave}>Changer le mot de passe</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
