import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DashboardStats {
    totalRevenue: number;
    pendingRevenue: number;
    invoicesCount: number;
    clientsCount: number;
    recentInvoices: any[];
}

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token'); // Ensure key matches auth service
    return { Authorization: `Bearer ${token}` };
};

const statsService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await axios.get(`${API_URL}/stats/dashboard`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },
};

export default statsService;
