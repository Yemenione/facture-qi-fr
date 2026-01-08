"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supportService, ServiceRequestDto } from "@/services/support.service"
import { useToast } from "@/providers/toast-provider"
import { Loader2, CheckCircle2 } from "lucide-react"

interface ServiceRequestModalProps {
    type: 'HIRE_ACCOUNTANT' | 'CONSULTATION';
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ServiceRequestModal({ type, trigger, open, onOpenChange }: ServiceRequestModalProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const toast = useToast()
    const [formData, setFormData] = useState<Partial<ServiceRequestDto>>({
        type: type,
        urgency: 'MEDIUM',
        contactPreference: 'EMAIL',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await supportService.createRequest(formData as ServiceRequestDto)
            setSuccess(true)
            toast.success("Demande envoyée", "Un conseiller vous recontactera sous 24h.")
            setTimeout(() => {
                setSuccess(false)
                onOpenChange?.(false)
            }, 2000)
        } catch (error) {
            toast.error("Erreur", "Une erreur est survenue lors de l'envoi.")
        } finally {
            setLoading(false)
        }
    }

    const title = type === 'HIRE_ACCOUNTANT' ? "Recruter un Expert-Comptable" : "Demander une Consultation"
    const description = type === 'HIRE_ACCOUNTANT'
        ? "Confiez votre comptabilité à un expert dédié pour plus de sérénité."
        : "Échangez avec un conseiller pour optimiser votre fiscalité."

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px] bg-brand-dark border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-heading text-brand-gold">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-medium text-white">Demande envoyée !</p>
                        <p className="text-sm text-zinc-400 text-center">Nous avons bien reçu votre demande.<br />Notre équipe vous contactera très rapidement.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Message / Besoins spécifiques</Label>
                            <Textarea
                                placeholder="Décrivez brièvement votre besoin..."
                                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Urgence</Label>
                                <Select
                                    value={formData.urgency}
                                    onValueChange={(v: any) => setFormData({ ...formData, urgency: v })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-brand-dark border-white/10 text-white">
                                        <SelectItem value="LOW">Normale</SelectItem>
                                        <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                        <SelectItem value="HIGH">Haute</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Contact par</Label>
                                <Select
                                    value={formData.contactPreference}
                                    onValueChange={(v: any) => setFormData({ ...formData, contactPreference: v })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-brand-dark border-white/10 text-white">
                                        <SelectItem value="EMAIL">Email</SelectItem>
                                        <SelectItem value="PHONE">Téléphone</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={loading} className="w-full bg-brand-gold text-brand-dark hover:bg-yellow-500 font-bold">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Envoyer la demande
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
