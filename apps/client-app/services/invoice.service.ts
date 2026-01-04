import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/invoices';

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
}

export interface CreateInvoiceDto {
    clientId: string;
    items: InvoiceItem[];
    dueDate?: string;
}

const invoiceService = {
    create: async (data: CreateInvoiceDto) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    findAll: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
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

    downloadPdf: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/${id}/pdf`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
        });
        return response.data;
    }
};

export default invoiceService;
