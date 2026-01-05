import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/products';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    vatRate: number;
    unit: string;
}

const productService = {
    getAll: async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    create: async (data: Omit<Product, 'id'>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${API_URL}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    update: async (id: string, data: Partial<Product>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(`${API_URL}/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    delete: async (id: string) => {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default productService;
