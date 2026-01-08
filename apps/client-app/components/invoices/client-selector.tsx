"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User, Search, Building2, Loader2, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { clientService } from "@/services/client.service"
import { Client } from "@/types/client"
import companyService from "@/services/company.service"
import { useToast } from "@/providers/toast-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClientSelectorProps {
    value?: string
    onChange: (value: string) => void
}

export function ClientSelector({ value, onChange }: ClientSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [clients, setClients] = React.useState<Client[]>([])
    const [siretInput, setSiretInput] = React.useState("")
    const [isSiretLoading, setIsSiretLoading] = React.useState(false)
    const toast = useToast()

    React.useEffect(() => {
        loadClients()
    }, [])

    const loadClients = () => {
        clientService.getAll().then(setClients).catch(console.error)
    }

    const handleSiretAdd = async () => {
        if (!siretInput || siretInput.length < 9) {
            toast.error("SIRET invalide", "Veuillez entrer au moins 9 chiffres.")
            return
        }

        setIsSiretLoading(true)
        try {
            // 1. Search Company Info
            const companyInfo = await companyService.searchSiret(siretInput)
            if (!companyInfo) {
                toast.error("Introuvable", "Aucune entreprise trouvée avec ce SIRET.")
                return
            }

            // 2. Create Client Automatically
            const newClientData = {
                name: companyInfo.name || "Client Inconnu",
                email: "", // Not provided by public registry
                phone: "",
                siret: companyInfo.siret,
                vatNumber: companyInfo.vatNumber,
                address: {
                    street: companyInfo.street || "",
                    zip: companyInfo.zipCode || "",
                    city: companyInfo.city || "",
                    country: "France"
                },
                isProfessional: true
            }

            const newClient = await clientService.create(newClientData)

            // 3. Update State
            setClients([...clients, newClient])
            onChange(newClient.id)
            setOpen(false)
            setSiretInput("")
            toast.success("Client ajouté", `${newClient.name} a été créé et sélectionné.`)

        } catch (error) {
            console.error("Auto-add error:", error)
            toast.error("Erreur", "Impossible d'ajouter le client automatiquement.")
        } finally {
            setIsSiretLoading(false)
        }
    }

    const selectedClient = clients.find((client) => client.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedClient ? (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-medium">{selectedClient.name}</span>
                        </div>
                    ) : (
                        "Sélectionner un client..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                    <Label className="text-xs font-semibold text-muted-foreground mb-2 block">Ajout Rapide par SIRET</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="N° SIRET"
                            value={siretInput}
                            onChange={(e) => setSiretInput(e.target.value)}
                            className="h-8 text-xs bg-white"
                        />
                        <Button
                            size="sm"
                            onClick={handleSiretAdd}
                            disabled={isSiretLoading}
                            className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                        >
                            {isSiretLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <Command>
                    <CommandInput placeholder="Ou rechercher un nom..." />
                    <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.name}
                                    onSelect={(currentValue) => {
                                        onChange(client.id)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === client.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{client.name}</span>
                                        <span className="text-xs text-muted-foreground">{client.email}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
