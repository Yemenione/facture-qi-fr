import React, { createContext, useContext, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence } from "framer-motion"
import { Toast, ToastType } from "../ui/toast-custom"

interface ToastContextType {
    toast: {
        success: (message: string, description?: string) => void
        error: (message: string, description?: string) => void
        warning: (message: string, description?: string) => void
        info: (message: string, description?: string) => void
    }
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context.toast
}

interface ToastItem {
    id: string
    type: ToastType
    message: string
    description?: string
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const addToast = useCallback((type: ToastType, message: string, description?: string) => {
        const id = Math.random().toString(36).substring(7)
        setToasts((prev) => [...prev, { id, type, message, description }])
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
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
            {createPortal(
                <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                    <div className="flex flex-col gap-2 pointer-events-auto">
                        <AnimatePresence mode="popLayout">
                            {toasts.map((t) => (
                                <Toast
                                    key={t.id}
                                    id={t.id}
                                    type={t.type}
                                    message={t.message}
                                    description={t.description}
                                    onDismiss={removeToast}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}
