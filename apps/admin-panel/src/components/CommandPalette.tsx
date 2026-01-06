import { useState, useEffect } from "react"
import { Search, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Mock data for now - in real app, fetch from API or filter existing lists
    const items = [
        { id: "dashboard", name: "Dashboard", type: "page", icon: <Building2 className="w-4 h-4" />, path: "/" },
        { id: "companies", name: "Companies List", type: "page", icon: <Building2 className="w-4 h-4" />, path: "/companies" },
        // ... we can add more mock or real data later
    ].filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    )

    const handleSelect = (path: string) => {
        navigate(path)
        setOpen(false)
        setQuery("")
    }

    if (!open) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border overflow-hidden p-2"
                >
                    <div className="flex items-center px-3 border-b pb-2 mb-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            className="flex-1 bg-transparent outline-none text-lg text-gray-800 placeholder:text-gray-400"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <kbd className="hidden sm:inline-block pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">ESC</span>
                        </kbd>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto py-2">
                        {items.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-6">No results found.</p>
                        ) : (
                            items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item.path)}
                                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left"
                                >
                                    <div className="mr-3 text-gray-400">{item.icon}</div>
                                    <div className="flex-1">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="ml-2 text-xs text-gray-400 capitalize">({item.type})</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="px-3 py-2 border-t mt-2 flex justify-between text-xs text-gray-400">
                        <span>factuer.fr admin</span>
                        <span>v1.0.0</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
