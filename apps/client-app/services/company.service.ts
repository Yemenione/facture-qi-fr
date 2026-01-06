import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Company {
    id: string;
    name: string;
    siren?: string;
    siret?: string;
    vatNumber?: string;
    vatSystem?: string;
    email?: string;
    phone?: string;
    address?: any;
    logoUrl?: string;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
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

    searchSiret: async (siret: string): Promise<Partial<Company>> => {
        const response = await axios.get(`${API_URL}/companies/search-siret/${siret}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    uploadLogo: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/companies/logo`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        // Returns the updated company, so we can extract logoUrl or backend might return just URL
        // Based on controller it calls updateLogo which calls prisma.update, so it returns Company object.
        return response.data.logoUrl;
    },
};

export default companyService;
