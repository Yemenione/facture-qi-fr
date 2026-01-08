"use client";

import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpertModeBanner() {
    const [isExpert, setIsExpert] = useState(false);

    useEffect(() => {
        // Check session storage on mount
        const expertStatus = sessionStorage.getItem("isExpertMode");
        setIsExpert(!!expertStatus);
    }, []);

    if (!isExpert) return null;

    const handleExit = () => {
        sessionStorage.removeItem("isExpertMode");
        localStorage.removeItem("access_token");
        // Redirect back to Accountant App (Assuming localhost:3001 for now, should be env var)
        window.location.href = "http://localhost:3001/dashboard";
    };

    return (
        <div className="bg-brand-blue text-white px-4 py-2 flex items-center justify-between shadow-md relative z-50 border-b border-white/10">
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand-gold" />
                <span className="font-heading font-medium text-sm tracking-wide">
                    Mode Expert Activé : Accès collaborateur comptable.
                </span>
            </div>
            <Button
                onClick={handleExit}
                variant="secondary"
                size="sm"
                className="bg-brand-gold text-brand-dark hover:bg-yellow-500 border-0 h-8 text-xs font-bold gap-2 shadow-sm"
            >
                <LogOut className="h-3 w-3" /> Quitter le mode expert
            </Button>
        </div>
    );
}
