// Local type definitions to avoid Prisma client dependency issues in build
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    total: number;
    invoiceId: string;
}

export interface Company {
    id: string;
    name: string;
    siret?: string | null;
    vatNumber?: string | null;
    email?: string | null;
    phone?: string | null;
    address: any;
    logoUrl?: string | null;
    legalForm?: string | null;
    capital?: string | null;
    rcsNumber?: string | null;
    settings?: CompanySettings | null;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    vatNumber?: string | null;
    address: any;
}

export interface CompanySettings {
    id: string;
    iban?: string | null;
    bic?: string | null;
    defaultLegalMention?: string | null;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    type: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE';
    issueDate: Date | string;
    dueDate?: Date | string | null;
    subTotal: number;
    taxAmount: number;
    total: number;
    terms?: string | null;
    items: InvoiceItem[];
    client: Client;
    company: Company;
}

export interface InvoiceTemplateProps {
    invoice: Invoice;
    customization?: {
        primaryColor?: string;
        secondaryColor?: string;
        logoPosition?: 'LEFT' | 'CENTER' | 'RIGHT';
        fontFamily?: string;
        showFooter?: boolean;
    };
    isPreview?: boolean;
}
