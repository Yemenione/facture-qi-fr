"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
    id: string
    type: ToastType
    message: string
    description?: string
    duration?: number
    onDismiss: (id: string) => void
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
}

const backgrounds = {
    success: "bg-green-50/90 border-green-200",
    error: "bg-red-50/90 border-red-200",
    warning: "bg-yellow-50/90 border-yellow-200",
    info: "bg-blue-50/90 border-blue-200"
}

export function Toast({ id, type, message, description, duration = 4000, onDismiss }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id)
        }, duration)
        return () => clearTimeout(timer)
    }, [id, duration, onDismiss])

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
                "w-full max-w-sm rounded-lg shadow-lg border p-4 backdrop-blur-md flex items-start gap-3 relative overflow-hidden",
                backgrounds[type]
            )}
        >
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1 mr-4">
                <h4 className={cn("text-sm font-semibold",
                    type === 'success' ? 'text-green-800' :
                        type === 'error' ? 'text-red-800' :
                            type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                )}>
                    {message}
                </h4>
                {description && (
                    <p className="text-xs text-gray-600 mt-1">{description}</p>
                )}
            </div>
            <button
                onClick={() => onDismiss(id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress Bar */}
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={cn(
                    "absolute bottom-0 left-0 h-1",
                    type === 'success' ? 'bg-green-500' :
                        type === 'error' ? 'bg-red-500' :
                            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                )}
            />
        </motion.div>
    )
}
