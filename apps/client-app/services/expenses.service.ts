import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Expense {
    id: string;
    description: string;
    amount: number;
    currency: string;
    date: string;
    supplier: string;
    category?: string;
    vatAmount?: number;
    proofUrl?: string;
    status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
}

export interface CreateExpenseDto {
    description: string;
    amount: number;
    currency?: string;
    date: string;
    supplier: string;
    category?: string;
    vatAmount?: number;
    proofUrl?: string;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { Authorization: `Bearer ${token}` };
};

const expensesService = {
    getAll: async (): Promise<Expense[]> => {
        const response = await axios.get(`${API_URL}/expenses`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    getStats: async (): Promise<any> => {
        const response = await axios.get(`${API_URL}/expenses/stats`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    create: async (data: any): Promise<Expense> => {
        // Data can be CreateExpenseDto or FormData
        const isFormData = data instanceof FormData;
        const response = await axios.post(`${API_URL}/expenses`, data, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            },
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/expenses/${id}`, {
            headers: getAuthHeader(),
        });
    },

    updateStatus: async (id: string, status: string): Promise<void> => {
        await axios.patch(`${API_URL}/expenses/${id}/status`, { status }, {
            headers: getAuthHeader(),
        });
    },

    scan: async (data: FormData): Promise<any> => {
        const response = await axios.post(`${API_URL}/expenses/scan`, data, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default expensesService;
