"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { clientService } from "@/services/client.service"
import companyService from "@/services/company.service"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function NewClientPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [searchingSiret, setSearchingSiret] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        isBusiness: true,
        siren: "",
        siret: "",
        vatNumber: "",
        legalForm: "",
        nafCode: "",
        vatSystem: "",
        phone: "",
        address: {
            street: "",
            city: "",
            zip: "",
            country: "France"
        }
    })

    const handleSiretSearch = async () => {
        if (!formData.siren || formData.siren.length < 9) {
            alert("Veuillez entrer un numéro SIREN ou SIRET valide (9 ou 14 chiffres).");
            return;
        }

        setSearchingSiret(true);
        try {
            const data = await companyService.searchSiret(formData.siren);
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    name: data.name || prev.name,
                    siren: data.siren || prev.siren, // Update SIREN if normalized
                    siret: (data as any).siret || prev.siret,
                    legalForm: (data as any).legalForm || prev.legalForm, // e.g. "Entrepreneur individuel"
                    nafCode: (data as any).nafCode || prev.nafCode,       // e.g. "6201Z"
                    vatNumber: (data as any).vatNumber || prev.vatNumber, // Auto-calculated Intra-EU VAT
                    address: {
                        street: (data as any).street || prev.address.street,
                        city: (data as any).city || prev.address.city,
                        zip: (data as any).zipCode || prev.address.zip,
                        country: (data as any).country || "France",
                    }
                }));
            }
        } catch (error) {
            console.error("Erreur recherche SIRET:", error);
            alert("Entreprise non trouvée ou erreur de connexion.");
        } finally {
            setSearchingSiret(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await clientService.create(formData)
            router.push("/dashboard/clients")
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || "Impossible de créer le client"}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Nouveau Client</h1>

            <form onSubmit={onSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="grid gap-2">
                            <Label>Type de client</Label>
                            <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="r1"
                                        name="clientType"
                                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                        checked={formData.isBusiness === true}
                                        onChange={() => setFormData({ ...formData, isBusiness: true })}
                                    />
                                    <Label htmlFor="r1">Entreprise (B2B)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="r2"
                                        name="clientType"
                                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                        checked={formData.isBusiness === false}
                                        onChange={() => setFormData({ ...formData, isBusiness: false })}
                                    />
                                    <Label htmlFor="r2">Particulier (B2C)</Label>
                                </div>
                            </div>
                        </div>

                        {formData.isBusiness && (
                            <div className="grid gap-4 p-4 border rounded-md bg-muted/20">
                                <div className="grid gap-2">
                                    <Label htmlFor="siren">Recherche par SIRET / SIREN</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="siren"
                                            placeholder="Ex: 123 456 789 00012"
                                            value={formData.siren}
                                            onChange={e => setFormData({ ...formData, siren: e.target.value.replace(/\s/g, '') })}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleSiretSearch}
                                            disabled={searchingSiret}
                                        >
                                            {searchingSiret ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Entrez le numéro SIRET pour remplir automatiquement les informations.</p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom / Raison Sociale *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.isBusiness && (
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="siret">SIRET (Code établissement)</Label>
                                    <Input
                                        id="siret"
                                        value={formData.siret}
                                        onChange={e => setFormData({ ...formData, siret: e.target.value })}
                                        placeholder="14 chiffres"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="legalForm">Forme Juridique</Label>
                                    <Input
                                        id="legalForm"
                                        value={formData.legalForm}
                                        onChange={e => setFormData({ ...formData, legalForm: e.target.value })}
                                        placeholder="Ex: SAS, SARL, Entrepreneur individuel..."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nafCode">Code NAF / APE</Label>
                                    <Input
                                        id="nafCode"
                                        value={formData.nafCode}
                                        onChange={e => setFormData({ ...formData, nafCode: e.target.value })}
                                        placeholder="Ex: 6201Z"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="vat">Numéro TVA</Label>
                                    <Input
                                        id="vat"
                                        placeholder="FR..."
                                        value={formData.vatNumber}
                                        onChange={e => setFormData({ ...formData, vatNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-4 space-y-4">
                            <Label>Adresse</Label>
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Adresse (Rue, complément...)"
                                    value={formData.address.street}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Input
                                        placeholder="Code Postal"
                                        value={formData.address.zip}
                                        onChange={e => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <Input
                                        placeholder="Ville"
                                        value={formData.address.city}
                                        onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Création..." : "Créer le client"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
