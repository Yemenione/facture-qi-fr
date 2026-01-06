"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            localStorage.setItem("accountant_token", token);
            router.push("/dashboard");
        } else {
            router.push("/login?error=no_token");
        }
    }, [router, searchParams]);

    return (
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-slate-500">Connexion sécurisée en cours...</p>
        </div>
    );
}

export default function AccountantAuthCallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <CallbackContent />
            </Suspense>
        </div>
    );
}
