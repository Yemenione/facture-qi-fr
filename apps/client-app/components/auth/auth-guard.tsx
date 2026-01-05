"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Function to check auth status
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated()
            if (!isAuth) {
                router.push("/login")
            } else {
                setIsAuthenticated(true)
            }
            setIsLoading(false)
        }

        // Check immediately
        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Only render children if authenticated
    if (!isAuthenticated) {
        return null // Will redirect in useEffect
    }

    return <>{children}</>
}
