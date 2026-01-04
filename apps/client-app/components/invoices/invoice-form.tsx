'use client'

import { useEffect } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useInvoiceStore } from '@/store/invoice-store'
import invoiceService from '@/services/invoice.service'

const invoiceSchema = z.object({
    clientId: z.string().min(1, "Veuillez sélectionner un client"),
    items: z.array(z.object({
        description: z.string().min(1, "Description requise"),
        quantity: z.number().min(0.01),
        unitPrice: z.number().min(0),
        vatRate: z.number().default(20),
    })).min(1, "Ajoutez au moins une ligne"),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

export function InvoiceForm() {
    const { draft, setDraft } = useInvoiceStore()

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: draft || {
            items: [{ description: '', quantity: 1, unitPrice: 0, vatRate: 20 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    const items = useWatch({ control: form.control, name: "items" })

    const totals = items.reduce((acc, item) => {
        const qty = Number(item.quantity) || 0
        const price = Number(item.unitPrice) || 0
        const vat = Number(item.vatRate) || 0

        const lineTotalHT = qty * price
        const lineTax = lineTotalHT * (vat / 100)

        return {
            ht: acc.ht + lineTotalHT,
            tax: acc.tax + lineTax,
            ttc: acc.ttc + lineTotalHT + lineTax
        }
    }, { ht: 0, tax: 0, ttc: 0 })

    useEffect(() => {
        const subscription = form.watch((value) => {
            setDraft(value)
        })
        return () => subscription.unsubscribe()
    }, [form.watch, setDraft])

    const onSubmit = async (data: InvoiceFormValues) => {
        try {
            console.log("Saving...", data)
            await invoiceService.create(data)
            alert('Facture brouillon créée !')
        } catch (e) {
            alert('Erreur sauvegarde')
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto py-10">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Nouvelle Facture</h1>
                <Button type="submit" size="lg">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                        <label className="text-sm font-medium mb-2 block">Client</label>
                        <select
                            {...form.register('clientId')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="">Sélectionner un client...</option>
                            <option value="client_1">ACME SAS</option>
                            <option value="client_2">Tech Corp</option>
                        </select>
                        {form.formState.errors.clientId && (
                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.clientId.message}</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground mb-2">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 text-right">Qté</div>
                                <div className="col-span-2 text-right">Prix HT</div>
                                <div className="col-span-1 text-right">TVA %</div>
                                <div className="col-span-1"></div>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-6">
                                        <Input {...form.register(`items.${index}.description`)} placeholder="Prestation..." />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="text-right"
                                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="text-right"
                                            {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Input
                                            type="number"
                                            className="text-right"
                                            {...form.register(`items.${index}.vatRate`, { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-4 border-dashed"
                                onClick={() => append({ description: '', quantity: 1, unitPrice: 0, vatRate: 20 })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="flex justify-end">
                <Card className="w-80 bg-slate-50">
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Total HT</span>
                            <span>{formatCurrency(totals.ht)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>TVA (Estimée)</span>
                            <span>{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total TTC</span>
                            <span className="text-primary">{formatCurrency(totals.ttc)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
