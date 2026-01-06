import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/templates';

export interface InvoiceTemplate {
    id: string;
    name: string;
    type: 'CLASSIC' | 'MODERN' | 'ELEGANT' | 'COLORFUL';
    isDefault: boolean;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    createdAt: string;
    // Add other fields as needed for the UI
}

export interface CreateTemplateDto {
    name: string;
    type: string;
    primaryColor?: string;
    secondaryColor?: string;
    [key: string]: any;
}

const templateService = {
    findAll: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get<InvoiceTemplate[]>(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    findOne: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get<InvoiceTemplate>(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    create: async (data: CreateTemplateDto) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post<InvoiceTemplate>(API_URL, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    update: async (id: string, data: Partial<CreateTemplateDto>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.put<InvoiceTemplate>(`${API_URL}/${id}`, data, {
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

    setDefault: async (id: string) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(`${API_URL}/${id}/set-default`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
};

export default templateService;
