"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import invoiceService from "@/services/invoice.service"
import { Loader2 } from "lucide-react"

export default function EditInvoicePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [invoiceData, setInvoiceData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) loadInvoice()
    }, [id])

    const loadInvoice = async () => {
        try {
            const data = await invoiceService.findOne(id)
            // Transform param match InvoiceFormValues (especially dates and embedded relations)
            const formValues = {
                type: data.type || 'INVOICE',
                clientId: data.clientId,
                validityDate: data.validityDate ? new Date(data.validityDate).toISOString().split('T')[0] : undefined,
                items: data.items.map((item: any) => ({
                    description: item.description,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice),
                    vatRate: Number(item.vatRate)
                }))
            }
            setInvoiceData(formValues)
        } catch (error) {
            console.error("Failed to load invoice", error)
            alert("Document introuvable")
            router.push("/dashboard/credit-notes")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    if (!invoiceData) return null

    return (
        <div className="pb-20">
            <h2 className="text-xl font-semibold mb-4 text-center text-slate-500">Modification du document</h2>
            <InvoiceForm initialData={invoiceData} invoiceId={id} />
        </div>
    )
}
