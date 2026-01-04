import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Company {
    id: string;
    name: string;
    siren?: string;
    vatNumber?: string;
    email?: string;
    phone?: string;
    address?: any;
    logoUrl?: string;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

const companyService = {
    get: async (): Promise<Company> => {
        const response = await axios.get(`${API_URL}/companies/me`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    update: async (data: Partial<Company>): Promise<Company> => {
        const response = await axios.patch(`${API_URL}/companies/me`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },
};

export default companyService;
