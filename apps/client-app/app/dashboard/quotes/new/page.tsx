"use client"

import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function NewQuotePage() {
    return (
        <div>
            <InvoiceForm initialData={{ type: 'QUOTE' }} />
        </div>
    )
}
