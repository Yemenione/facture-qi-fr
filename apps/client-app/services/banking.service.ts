import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface BankAccount {
    id: string;
    name: string;
    bankName: string;
    iban: string;
    currency: string;
    _count?: {
        transactions: number;
    }
}

export interface BankTransaction {
    id: string;
    date: string;
    label: string;
    amount: number;
    reference: string;
    status: 'PENDING' | 'MATCHED' | 'IGNORED';
}

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { Authorization: `Bearer ${token}` };
};

const bankingService = {
    getAccounts: async (): Promise<BankAccount[]> => {
        const response = await axios.get(`${API_URL}/banking/accounts`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    createAccount: async (data: { name: string, bankName: string, iban: string, currency: string }) => {
        const response = await axios.post(`${API_URL}/banking/accounts`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    deleteAccount: async (id: string) => {
        await axios.delete(`${API_URL}/banking/accounts/${id}`, {
            headers: getAuthHeader(),
        });
    },

    getTransactions: async (accountId: string): Promise<BankTransaction[]> => {
        const response = await axios.get(`${API_URL}/banking/accounts/${accountId}/transactions`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    importStatement: async (accountId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/banking/accounts/${accountId}/import`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default bankingService;
