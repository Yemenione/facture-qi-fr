"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterFirmPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    if (step === 2) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Card className="w-full max-w-md shadow-xl border-green-100">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-800">Demande envoyée !</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Votre demande de partenariat a bien été reçue. Notre équipe va valider votre dossier sous 24h.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center pb-8">
                        <Link href="/">
                            <Button variant="outline">Retour à l'accueil</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Split Layout: Image on Left */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                 <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
                 <div className="relative z-10 max-w-lg text-white p-12">
                     <h2 className="text-4xl font-bold mb-6">Rejoignez l'élite de l'expertise comptable</h2>
                     <ul className="space-y-4 text-lg text-slate-200">
                         <li className="flex items-center gap-3">
                             <CheckCircle2 className="w-6 h-6 text-blue-400" />
                             Gain de productivité de 40%
                         </li>
                         <li className="flex items-center gap-3">
                             <CheckCircle2 className="w-6 h-6 text-blue-400" />
                             Attraction de nouveaux clients
                         </li>
                         <li className="flex items-center gap-3">
                             <CheckCircle2 className="w-6 h-6 text-blue-400" />
                             Conformité Factur-X native
                         </li>
                     </ul>
                 </div>
            </div>

            {/* Form on Right */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-1 px-0">
                        <CardTitle className="text-3xl font-bold">Créer un compte cabinet</CardTitle>
                        <CardDescription>
                            Commencez votre essai gratuit de 30 jours
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                        <CardContent className="space-y-4 px-0">
                            <div className="space-y-2">
                                <Label htmlFor="firmName">Nom du cabinet</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input id="firmName" placeholder="Ex: Cabinet Martin & Associés" className="pl-9" required />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" placeholder="Jean" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" placeholder="Dupont" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email professionnel</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input id="email" type="email" placeholder="jean@cabinet.fr" className="pl-9" required />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input id="password" type="password" className="pl-9" required />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                                <label htmlFor="terms" className="text-sm text-slate-500">
                                    J'accepte les <Link href="#" className="text-blue-600 hover:underline">Conditions Générales</Link>
                                </label>
                            </div>
                        </CardContent>
                        <CardFooter className="px-0 flex-col gap-4">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : <>Créer mon compte <ArrowRight className="ml-2 w-4 h-4" /></>}
                            </Button>
                            <div className="text-center text-sm text-slate-500">
                                Déjà partenaire ? <Link href="/login" className="text-blue-600 font-medium hover:underline">Se connecter</Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
