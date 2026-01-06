
import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/exports';

export const exportService = {
    downloadFec: async (year: number) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/fec`, {
            params: { year },
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
        });
        return response.data;
    }
}
