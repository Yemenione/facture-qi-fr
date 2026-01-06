"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Loader2 } from "lucide-react"

export default function ImpersonatePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const { setToken } = useAuthStore()

    useEffect(() => {
        if (token) {
            // 1. Store the token
            setToken(token)
            localStorage.setItem("access_token", token)

            // 2. Redirect to dashboard
            // Small delay to ensure state update
            setTimeout(() => {
                router.push("/dashboard")
            }, 500)
        } else {
            router.push("/login?error=missing_token")
        }
    }, [token, router, setToken])

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
                <h1 className="text-xl font-semibold text-slate-900">Connexion en tant que client...</h1>
                <p className="text-slate-500">Vous allez être redirigé vers le tableau de bord.</p>
            </div>
        </div>
    )
}
