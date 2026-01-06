"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, KeyRound } from "lucide-react";
import api from "@/services/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // NOTE: Using the admin auth endpoint for now
            const response = await api.post("/auth/login", { 
                email, 
                password 
            });

            const { access_token } = response.data;
            if (access_token) {
                localStorage.setItem("accountant_token", access_token);
                router.push("/dashboard");
            } else {
                setError("Login failed. No token received.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Email ou mot de passe incorrect.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <KeyRound className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Portail Expert-Comptable</CardTitle>
                    <CardDescription>
                        Connectez-vous pour accéder aux dossiers de vos clients
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-2 h-11 border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`}
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                <path
                                    d="M12.0003 20.45c4.6667 0 7.9167-3.25 7.9167-7.9167 0-.75-.0834-1.5-.25-2.25h-7.6667v4.25h4.4167c-.25 1.25-1.1667 3-2.9167 4.1667l2.5 1.9167c1.5-1.3334 2.3333-3.0834 2.3333-5.0834v-.0833h-9.9167v-8.8333h5.75c1.75 0 3.3333.6666 4.5833 1.75l-3.3333 3.3333c-.75-.75-1.75-1.1667-3-1.1667-2.5833 0-4.6667 2.0834-4.6667 4.6667s2.0834 4.6667 4.6667 4.6667z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12.0003 20.45c-2.4167 0-4.5-1.3333-5.6667-3.4167l-2.8333 2.1667c1.75 3.3333 5.4166 5.5 9.4999 5.5 2.5 0 4.75-.8333 6.3334-2.25l-2.5-1.9167c-.75.5834-1.8334.9167-3.0834.9167z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M6.3336 17.0333c-.3333-.9166-.5-1.9166-.5-2.9166s.1667-2 .5-2.9167l-2.8333-2.1666c-1.0834 2.1666-1.0834 4.9166 0 7.0833l2.8333-2.1667z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.0003 7.5833c1.6667 0 2.9167.5834 3.8333 1.4167l2.9167-2.9167c-1.8333-1.6666-4.25-2.5-6.75-2.5-4.0833 0-7.75 2.1667-9.5 5.5l2.8333 2.1667c1.1667-2.0833 3.25-3.4167 5.6667-3.4167z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continuer avec Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">ou avec email</span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email professionnel</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="expert@cabinet.fr"
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-9"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
