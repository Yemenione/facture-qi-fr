import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/products';

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    vatRate: number;
    unit?: string;
}

const productService = {
    create: async (data: CreateProductDto) => {
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

export default productService;
