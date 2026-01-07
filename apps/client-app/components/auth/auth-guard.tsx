"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService } from "@/services/auth.service"
import companyService from "@/services/company.service"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Check Login
            const isAuth = authService.isAuthenticated()
            if (!isAuth) {
                router.push("/login")
                return
            }

            // 2. Check Company Profile (if logged in)
            try {
                // Only check profile if we are NOT already on the onboarding page to avoid loops
                // But we ALSO want to protect the onboarding page (require login), which we passed above.

                // Optimization: Maybe store this in a global store or cookie to avoid fetching every time.
                // For now, fetching is safe as it's efficient.

                if (pathname === '/onboarding') {
                    // Logic: If on onboarding, maybe check if ALREADY completed to redirect to dashboard?
                    // Let's do it simple: just allow access if logged in.
                    setIsAuthenticated(true)
                    setIsLoading(false)
                    return
                }

                // If on dashboard or other protected routes
                const company = await companyService.get()
                const isProfileComplete = company.siret && company.name && company.address?.street

                if (!isProfileComplete) {
                    console.log("Profile incomplete, redirecting to onboarding")
                    router.push("/onboarding")
                    return
                }

                setIsAuthenticated(true)
            } catch (error) {
                console.error("Auth Guard Check Failed", error)
                // If API fails (e.g. 401), logout
                // authService.logout()
                // router.push("/login")
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router, pathname])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                    <p className="text-sm text-slate-500 animate-pulse">Vérification du compte...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated && pathname !== '/onboarding') {
        return null
    }

    return <>{children}</>
}
