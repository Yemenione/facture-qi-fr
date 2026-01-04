import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/clients';

export interface CreateClientDto {
    name: string;
    email: string;
    isBusiness?: boolean;
    siren?: string;
    vatNumber?: string;
    address?: any;
    phone?: string;
}

const clientService = {
    create: async (data: CreateClientDto) => {
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
    }
};

export default clientService;
