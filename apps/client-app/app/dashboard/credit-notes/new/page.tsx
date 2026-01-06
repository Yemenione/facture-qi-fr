"use client"

import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function NewCreditNotePage() {
    return (
        <div>
            <InvoiceForm initialData={{ type: 'CREDIT_NOTE' }} />
        </div>
    )
}
