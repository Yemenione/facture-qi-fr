import { Invoice, InvoiceItem, Company, Client, CompanySettings } from "@prisma/client"

export interface InvoiceTemplateProps {
    invoice: Invoice & {
        items: InvoiceItem[]
        client: Client
        company: Company & {
            settings?: CompanySettings | null
        }
    }
    customization?: {
        primaryColor?: string
        secondaryColor?: string
        logoPosition?: 'LEFT' | 'CENTER' | 'RIGHT'
        fontFamily?: string
        showFooter?: boolean
    }
    isPreview?: boolean // If true, might render with dummy data or restricted interactivity
}
