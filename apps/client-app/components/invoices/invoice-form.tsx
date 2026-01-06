'use client'

// Enhanced invoice form with French localization and advanced features
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, Save, Calendar, FileText, User, CreditCard, MessageSquare, Percent, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useInvoiceStore } from '@/store/invoice-store'
import invoiceService from '@/services/invoice.service'
import { ProductSelector } from './product-selector'
import { ClientSelector } from './client-selector'
import { DatePicker } from '@/components/ui/date-picker'
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'

const invoiceSchema = z.object({
    type: z.enum(['INVOICE', 'QUOTE', 'CREDIT_NOTE']).default('INVOICE'),
    clientId: z.string().min(1, "Veuillez sélectionner un client"),
    issueDate: z.date({ required_error: "Date requise" }).or(z.string().transform(str => new Date(str))),
    dueDate: z.date({ required_error: "Date requise" }).or(z.string().transform(str => new Date(str))),
    validityDate: z.date().optional().or(z.string().optional().transform(str => str ? new Date(str) : undefined)),
    paymentTerms: z.string().optional(),
    discount: z.number().default(0),
    discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
    notes: z.string().optional(),
    items: z.array(z.object({
        description: z.string().min(1, "Description requise"),
        quantity: z.number().min(0.01),
        unitPrice: z.number().min(0),
        vatRate: z.number().default(20),
    })).min(1, "Ajoutez au moins une ligne"),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
    initialData?: any
    invoiceId?: string
}

export function InvoiceForm({ initialData, invoiceId }: InvoiceFormProps) {
    const { draft, setDraft } = useInvoiceStore()
    const router = useRouter()
    const [showAdvanced, setShowAdvanced] = useState(false)

    const parseDate = (d: any) => d ? new Date(d) : undefined;

    const getDefaults = () => {
        if (initialData) {
            return {
                ...initialData,
                issueDate: parseDate(initialData.issueDate),
                dueDate: parseDate(initialData.dueDate),
                validityDate: parseDate(initialData.validityDate),
                discount: initialData.discount || 0,
                discountType: initialData.discountType || 'PERCENTAGE',
                paymentTerms: initialData.paymentTerms || '',
                notes: initialData.notes || '',
            }
        }
        if (draft) {
            return {
                ...draft,
                issueDate: parseDate(draft.issueDate),
                dueDate: parseDate(draft.dueDate),
                validityDate: parseDate(draft.validityDate),
                discount: draft.discount || 0,
                discountType: draft.discountType || 'PERCENTAGE',
                paymentTerms: draft.paymentTerms || '',
                notes: draft.notes || '',
            }
        }
        return {
            issueDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            items: [{ description: 'Prestation standard', quantity: 1, unitPrice: 0, vatRate: 20 }],
            discount: 0,
            discountType: 'PERCENTAGE' as const,
            paymentTerms: 'Paiement à 30 jours',
            notes: '',
        }
    }

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: getDefaults()
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    const items = useWatch({ control: form.control, name: "items" })
    const discount = useWatch({ control: form.control, name: "discount" }) || 0
    const discountType = useWatch({ control: form.control, name: "discountType" })

    const totals = (items || []).reduce((acc, item) => {
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

    // Calculate discount
    const discountAmount = discountType === 'PERCENTAGE'
        ? (totals.ht * discount) / 100
        : discount

    const finalTotals = {
        ht: totals.ht,
        discount: discountAmount,
        htAfterDiscount: totals.ht - discountAmount,
        tax: (totals.ht - discountAmount) * (totals.tax / totals.ht),
        ttc: (totals.ht - discountAmount) + ((totals.ht - discountAmount) * (totals.tax / totals.ht))
    }

    useEffect(() => {
        if (!initialData) {
            const subscription = form.watch((value) => {
                setDraft(value as any)
            })
            return () => subscription.unsubscribe()
        }
    }, [form.watch, setDraft, initialData])

    useEffect(() => {
        const currentItems = form.getValues('items');
        if (currentItems && currentItems.length > 0) {
            let changed = false;
            const newItems = currentItems.map(item => {
                if (!item.description || item.description.trim() === '') {
                    changed = true;
                    return { ...item, description: 'Prestation standard' };
                }
                return item;
            });
            if (changed) {
                form.setValue('items', newItems);
            }
        }
    }, [form]);

    const onSubmit = async (data: InvoiceFormValues) => {
        try {
            const sanitizedItems = data.items.map(item => ({
                ...item,
                description: item.description?.trim() || 'Prestation standard'
            }));

            const payload = {
                ...data,
                items: sanitizedItems,
                issueDate: data.issueDate,
                dueDate: data.dueDate,
                validityDate: data.validityDate
            }

            if (invoiceId) {
                await invoiceService.update(invoiceId, payload)
                alert('Document mis à jour avec succès !')
            } else {
                await invoiceService.create(payload)
                alert('Document créé avec succès !')
            }
            router.push('/dashboard/invoices')
        } catch (e: any) {
            console.error(e)
            const msg = e.response?.data?.message
                || (e.response ? `Status: ${e.response.status}` : '')
                || e.message
                || "Erreur inconnue";
            alert(`DEBUG ERROR:\n${JSON.stringify(e.response?.data || {}, null, 2)}\n\nMessage: ${msg}`)
        }
    }

    // Auto-calculate due date based on payment terms
    const updateDueDateFromTerms = (terms: string) => {
        const issueDate = form.getValues('issueDate')
        if (!issueDate) return

        const days = parseInt(terms.match(/\d+/)?.[0] || '30')
        const newDueDate = new Date(issueDate)
        newDueDate.setDate(newDueDate.getDate() + days)
        form.setValue('dueDate', newDueDate)
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {invoiceId ? 'Modifier le document' : 'Nouveau document'}
                        </h1>
                        <p className="text-slate-600 mt-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {form.watch('type') === 'QUOTE' ? 'Créez un devis professionnel conforme' :
                                form.watch('type') === 'CREDIT_NOTE' ? 'Créez un avoir conforme' :
                                    'Créez une facture conforme aux normes françaises'}
                        </p>
                    </div>
                    <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all">
                        <Save className="mr-2 h-5 w-5" /> Enregistrer
                    </Button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Client & Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Client Selection */}
                        <Card className="border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Informations Client</h3>
                                        <p className="text-xs text-slate-500">Sélectionnez ou créez un client</p>
                                    </div>
                                </div>
                                <ClientSelector
                                    value={form.watch('clientId')}
                                    onChange={(value) => form.setValue('clientId', value, { shouldValidate: true })}
                                />
                                {form.formState.errors.clientId && (
                                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                        <span className="text-red-500">⚠</span> {form.formState.errors.clientId.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Invoice Items */}
                        <Card className="border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                                            <FileText className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">Lignes de facture</h3>
                                            <p className="text-xs text-slate-500">{fields.length} ligne(s) • Total: {formatCurrency(totals.ht)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-slate-600 px-3 py-2 bg-slate-50 rounded-lg">
                                        <div className="col-span-5">Description</div>
                                        <div className="col-span-2 text-right">Quantité</div>
                                        <div className="col-span-2 text-right">Prix HT</div>
                                        <div className="col-span-2 text-right">TVA %</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {/* Items */}
                                    {fields.map((field, index) => {
                                        const item = items[index] || {}
                                        const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)

                                        return (
                                            <div key={field.id} className="grid grid-cols-12 gap-3 items-center bg-gradient-to-r from-white to-blue-50/30 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                                <div className="col-span-5">
                                                    <Input
                                                        {...form.register(`items.${index}.description`)}
                                                        placeholder="Ex: Développement web, Consulting..."
                                                        className="border-slate-300 focus:border-blue-500 bg-white"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Controller
                                                        control={form.control}
                                                        name={`items.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <NumberInput
                                                                className="text-right border-slate-300 focus:border-blue-500 bg-white"
                                                                value={field.value}
                                                                onValueChange={(values) => field.onChange(values.floatValue)}
                                                                decimalScale={2}
                                                                placeholder="1,00"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Controller
                                                        control={form.control}
                                                        name={`items.${index}.unitPrice`}
                                                        render={({ field }) => (
                                                            <NumberInput
                                                                className="text-right border-slate-300 focus:border-blue-500 bg-white"
                                                                value={field.value}
                                                                onValueChange={(values) => field.onChange(values.floatValue)}
                                                                decimalScale={2}
                                                                suffix=" €"
                                                                placeholder="0,00"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <Controller
                                                        control={form.control}
                                                        name={`items.${index}.vatRate`}
                                                        render={({ field }) => (
                                                            <NumberInput
                                                                className="text-right border-slate-300 focus:border-blue-500 bg-white"
                                                                value={field.value}
                                                                onValueChange={(values) => field.onChange(values.floatValue)}
                                                                decimalScale={2}
                                                                suffix=" %"
                                                                placeholder="20,00"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-1 flex flex-col items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    {lineTotal > 0 && (
                                                        <span className="text-xs font-semibold text-blue-600">
                                                            {formatCurrency(lineTotal)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Add Line Buttons */}
                                    <div className="flex gap-3 pt-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 border-dashed border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-700 font-medium"
                                            onClick={() => append({ description: '', quantity: 1, unitPrice: 0, vatRate: 20 })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Ligne vide
                                        </Button>

                                        <div className="flex-1">
                                            <ProductSelector onSelect={(product) => {
                                                append({
                                                    description: product.name + (product.description ? ` - ${product.description}` : ''),
                                                    quantity: 1,
                                                    unitPrice: product.price,
                                                    vatRate: product.vatRate
                                                })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes Section */}
                        <Card className="border-slate-200 shadow-md bg-white/80 backdrop-blur">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <MessageSquare className="h-5 w-5 text-slate-600" />
                                    <h3 className="font-semibold text-slate-900">Notes et commentaires</h3>
                                </div>
                                <Textarea
                                    {...form.register('notes')}
                                    placeholder="Ajoutez des notes, conditions de paiement, ou informations supplémentaires..."
                                    className="min-h-[100px] border-slate-300 focus:border-blue-500"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Document Details & Summary */}
                    <div className="space-y-6">

                        {/* Document Type & Dates */}
                        <Card className="border-blue-200 shadow-md hover:shadow-lg transition-all bg-white/90 backdrop-blur">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-lg">Détails du document</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Type de document</label>
                                    <select
                                        {...form.register('type')}
                                        className="flex h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="INVOICE">📄 Facture</option>
                                        <option value="QUOTE">📋 Devis</option>
                                        <option value="CREDIT_NOTE">📝 Avoir</option>
                                    </select>
                                </div>

                                <div className="space-y-4 pt-3 border-t-2 border-slate-100">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Date d'émission</label>
                                        <Controller
                                            control={form.control}
                                            name="issueDate"
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="JJ/MM/AAAA"
                                                    className="border-slate-300"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Conditions de paiement
                                        </label>
                                        <select
                                            {...form.register('paymentTerms')}
                                            onChange={(e) => {
                                                form.setValue('paymentTerms', e.target.value)
                                                updateDueDateFromTerms(e.target.value)
                                            }}
                                            className="flex h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Paiement immédiat">Paiement immédiat</option>
                                            <option value="Paiement à 15 jours">À 15 jours</option>
                                            <option value="Paiement à 30 jours">À 30 jours</option>
                                            <option value="Paiement à 45 jours">À 45 jours</option>
                                            <option value="Paiement à 60 jours">À 60 jours</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                            {form.watch('type') === 'QUOTE' ? 'Validité jusqu\'au' : 'Date d\'échéance'}
                                        </label>
                                        <Controller
                                            control={form.control}
                                            name="dueDate"
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="JJ/MM/AAAA"
                                                    className="border-slate-300"
                                                />
                                            )}
                                        />
                                    </div>

                                    {form.watch('type') === 'QUOTE' && (
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 block">Date de validité</label>
                                            <Controller
                                                control={form.control}
                                                name="validityDate"
                                                render={({ field }) => (
                                                    <DatePicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="JJ/MM/AAAA"
                                                        className="border-slate-300"
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Discount Section */}
                        <Card className="border-green-200 shadow-md bg-gradient-to-br from-green-50 to-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Percent className="h-5 w-5 text-green-600" />
                                    <CardTitle className="text-lg">Remise</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Controller
                                            control={form.control}
                                            name="discount"
                                            render={({ field }) => (
                                                <NumberInput
                                                    className="border-green-300 focus:border-green-500"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.floatValue || 0)}
                                                    decimalScale={2}
                                                    placeholder="0,00"
                                                />
                                            )}
                                        />
                                    </div>
                                    <select
                                        {...form.register('discountType')}
                                        className="w-24 rounded-lg border-2 border-green-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="PERCENTAGE">%</option>
                                        <option value="FIXED">€</option>
                                    </select>
                                </div>
                                {discountAmount > 0 && (
                                    <p className="text-sm text-green-700 font-medium">
                                        Économie: {formatCurrency(discountAmount)}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Total Summary */}
                        <Card className="border-blue-300 bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Récapitulatif
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm text-blue-100">
                                    <span>Total HT</span>
                                    <span className="font-semibold text-white">{formatCurrency(finalTotals.ht)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <>
                                        <div className="flex justify-between text-sm text-green-200">
                                            <span>Remise</span>
                                            <span className="font-semibold">- {formatCurrency(discountAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-blue-100 border-t border-blue-400 pt-2">
                                            <span>Total HT après remise</span>
                                            <span className="font-semibold text-white">{formatCurrency(finalTotals.htAfterDiscount)}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between text-sm text-blue-100">
                                    <span>TVA</span>
                                    <span className="font-semibold text-white">{formatCurrency(finalTotals.tax)}</span>
                                </div>
                                <div className="border-t-2 border-blue-400 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-lg">Total TTC</span>
                                    <span className="font-bold text-3xl">{formatCurrency(finalTotals.ttc)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Card */}
                        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                            <CardContent className="pt-6">
                                <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-2">
                                    💡 Conseils & Astuces
                                </h4>
                                <ul className="text-xs text-amber-800 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">•</span>
                                        <span>Vérifiez les informations client avant validation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">•</span>
                                        <span>Format des dates: JJ/MM/AAAA (ex: 05/01/2026)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">•</span>
                                        <span>Montants avec virgule (ex: 1 234,56 €)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">•</span>
                                        <span>TVA standard: 20% • Réduite: 10%, 5,5%</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </form>
    )
}
