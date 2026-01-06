import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/accounting';

export interface MonthlyStat {
    month: number;
    revenue: number;
    vat: number;
    invoiceCount: number;
}

export interface AccountingStats {
    year: number;
    totalRevenue: number;
    totalVat: number;
    monthlyStats: MonthlyStat[];
}

export const accountingService = {
    getStats: async (year: number): Promise<AccountingStats> => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/stats`, {
            params: { year },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getJournal: async (limit = 50) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/journal`, {
            params: { limit },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
