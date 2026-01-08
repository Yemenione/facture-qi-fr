import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/invoices';

export interface InvoiceItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
}

export interface CreateInvoiceDto {
    clientId: string;
    items: InvoiceItemDto[];
    type?: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE';
    validityDate?: Date | string;
    issueDate?: Date | string;
    dueDate?: Date | string;
    paymentTerms?: string;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    notes?: string;
}

const invoiceService = {
    create: async (data: CreateInvoiceDto) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    update: async (id: string, data: Partial<CreateInvoiceDto>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    findAll: async (type?: 'INVOICE' | 'QUOTE' | 'CREDIT_NOTE') => {
        const token = localStorage.getItem('access_token');
        const params = type ? { type } : {};
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params
        });
        return response.data;
    },

    findOne: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    async updateStatus(id: string, status: string) {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    downloadPdf: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/${id}/pdf`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
        });
        return response.data;
    },

    sendEmail: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/${id}/send`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    convertToInvoice: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/${id}/convert`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    delete: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createCreditNote: async (invoiceId: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/${invoiceId}/credit-note`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
};

export default invoiceService;
