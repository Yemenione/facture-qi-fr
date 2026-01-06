"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Mail, Building2, Smartphone } from "lucide-react";

export function AddClientModal({ onClientAdded }: { onClientAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call (In real implementation: POST /companies/invite)
        // For now we just timeout to simulate success
        setTimeout(() => {
            setIsLoading(false);
            setOpen(false);
            setEmail("");
            setCompanyName("");
            setPhone("");
            onClientAdded(); // Trigger refresh/notification in parent
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Inviter un nouveau client</DialogTitle>
                    <DialogDescription>
                        Le client recevra un email pour activer son espace et connecter ses banques.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Raison Sociale</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    id="companyName" 
                                    placeholder="ex: SAS Dupont" 
                                    className="pl-9"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email du dirigeant</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="contact@dupont.com" 
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone (Optionnel)</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    id="phone" 
                                    type="tel" 
                                    placeholder="06 12 34 56 78" 
                                    className="pl-9"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Envoyer l'invitation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
