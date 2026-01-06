"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Toast, ToastType } from "@/components/ui/toast-custom"
import { AnimatePresence } from "framer-motion"

interface ToastContextType {
    toast: {
        success: (message: string, description?: string) => void
        error: (message: string, description?: string) => void
        warning: (message: string, description?: string) => void
        info: (message: string, description?: string) => void
    }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Array<{ id: string, type: ToastType, message: string, description?: string }>>([])

    const addToast = useCallback((type: ToastType, message: string, description?: string) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts(prev => [...prev, { id, type, message, description }])
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const toast = {
        success: (message: string, description?: string) => addToast("success", message, description),
        error: (message: string, description?: string) => addToast("error", message, description),
        warning: (message: string, description?: string) => addToast("warning", message, description),
        info: (message: string, description?: string) => addToast("info", message, description),
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-2">
                    <AnimatePresence mode="popLayout">
                        {toasts.map(t => (
                            <Toast
                                key={t.id}
                                {...t}
                                onDismiss={removeToast}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context.toast
}
