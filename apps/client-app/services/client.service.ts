import axios from 'axios';
import { Client, CreateClientDto } from "@/types/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const clientService = {
    getAll: async (): Promise<Client[]> => {
        const response = await axios.get(`${API_URL}/clients`, getAuthHeader());
        return response.data;
    },

    getOne: async (id: string): Promise<Client> => {
        const response = await axios.get(`${API_URL}/clients/${id}`, getAuthHeader());
        return response.data;
    },

    create: async (data: CreateClientDto): Promise<Client> => {
        const response = await axios.post(`${API_URL}/clients`, data, getAuthHeader());
        return response.data;
    },

    update: async (id: string, data: Partial<CreateClientDto>): Promise<Client> => {
        const response = await axios.patch(`${API_URL}/clients/${id}`, data, getAuthHeader());
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/clients/${id}`, getAuthHeader());
    }
};
