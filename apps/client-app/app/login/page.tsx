'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { api } from '@/services/invoice.service'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Direct axios call to auth endpoint
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', res.data.access_token)
            alert("Connexion réussie !")
            window.location.href = '/dashboard' // Simple redirect
        } catch (error) {
            alert("Erreur de connexion")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Connexion Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="vous@entreprise.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">Se connecter</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
