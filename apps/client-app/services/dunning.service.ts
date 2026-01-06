import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/dunning';

export interface OverdueInvoice {
    id: string;
    invoiceNumber: string;
    dueDate: string;
    total: number;
    subTotal: number;
    taxAmount: number;
    reminderLevel: number;
    lastReminderDate: string | null;
    client: {
        name: string;
        email: string;
        phone: string | null;
    }
}

export const dunningService = {
    getOverdue: async (): Promise<OverdueInvoice[]> => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/overdue`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    remind: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}/${id}/remind`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
