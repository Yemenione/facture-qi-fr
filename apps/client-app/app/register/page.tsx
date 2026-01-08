'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth-store';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planCode = searchParams.get('plan') || 'FREE';
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        planCode: planCode.toUpperCase()
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { login } = useAuthStore();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.register(formData);
            login(data.user, data.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

            {/* Visual Side (Left) */}
            <div className="relative hidden h-full flex-col bg-brand-dark p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-brand-dark" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-brand-blue/20" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <div className="mr-2 h-8 w-8 rounded-lg bg-gradient-to-br from-brand-gold to-yellow-500 flex items-center justify-center font-bold text-white shadow-lg">
                        I
                    </div>
                    Invoicer FR
                </div>

                <div className="relative z-20 mt-auto">
                    <h2 className="text-3xl font-heading font-bold mb-4">Rejoignez l'élite.</h2>
                    <blockquote className="space-y-2">
                        <p className="text-lg text-zinc-300">
                            "Depuis que nous sommes passés sur Invoicer FR, notre facturation est passée de 'corvée' à 'avantage compétitif'. C'est fluide, beau, et ultra-rapide."
                        </p>
                        <footer className="text-sm font-semibold text-brand-gold">Marc T. - CEO de TechFlow</footer>
                    </blockquote>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
                        <p className="text-sm text-muted-foreground">
                            Entrez vos informations pour commencer gratuitement.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            {error && (
                                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Acme Inc."
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" name="firstName" placeholder="Jean" onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" name="lastName" placeholder="Dupont" onChange={handleChange} required disabled={loading} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="jean@exemple.com" onChange={handleChange} required disabled={loading} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input id="password" name="password" type="password" onChange={handleChange} required disabled={loading} />
                            </div>

                            <Button className="w-full bg-brand-blue hover:bg-brand-blue/90" type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                S'inscrire
                            </Button>
                        </div>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-brand-blue">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
