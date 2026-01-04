import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Hardcoded for now, ideal to use env

const getAuthHeader = () => {
    const token = localStorage.getItem('admin_token');
    return { Authorization: `Bearer ${token}` };
};

export const adminService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/admin/auth/login`, { email, password });
        if (response.data.access_token) {
            localStorage.setItem('admin_token', response.data.access_token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
    },

    getCompanies: async () => {
        const response = await axios.get(`${API_URL}/admin/companies`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
