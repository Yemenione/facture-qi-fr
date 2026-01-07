"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent")
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted")
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "declined")
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border border-slate-200 shadow-2xl rounded-xl p-6 z-50 ring-1 ring-slate-900/5"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                            <Cookie className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">Cookies 🍪</h3>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAccept} className="bg-slate-900 text-white hover:bg-slate-800">
                                    Accepter
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleDecline}>
                                    Refuser
                                </Button>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
