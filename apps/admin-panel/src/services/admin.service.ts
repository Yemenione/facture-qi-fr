import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Hardcoded for now, ideal to use env

const getAuthHeader = () => {
    const token = localStorage.getItem('admin_token');
    return { Authorization: `Bearer ${token}` };
};

export const adminService = {
    login: async (email: string, password: string) => {
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
    },

    async impersonate(companyId: string) {
        const token = localStorage.getItem('admin_token');
        const response = await axios.post(`${API_URL}/admin/companies/${companyId}/impersonate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async downloadBackup() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/ops/backup`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
        });
        return response.data;
    },

    async updateCompany(id: string, data: any) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/companies/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async deleteCompany(id: string) {
        const token = localStorage.getItem('admin_token');
        return axios.delete(`${API_URL}/admin/companies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // --- User Management ---
    async getUsers() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async updateUser(id: string, data: any) {
        const token = localStorage.getItem('admin_token');
        return axios.patch(`${API_URL}/admin/users/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async deleteUser(id: string) {
        const token = localStorage.getItem('admin_token');
        return axios.delete(`${API_URL}/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // --- Verification Center ---
    async getPendingVerifications() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/verification/pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async approveVerification(id: string) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/verification/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async rejectVerification(id: string) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/verification/${id}/reject`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // --- Support Tickets ---
    async getAllTickets() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async replyTicket(id: string, content: string, status?: string) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/tickets/${id}/reply`, { content, status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // --- Broadcasts ---
    async getBroadcasts() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/broadcasts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async createBroadcast(data: any) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/broadcasts`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async deleteBroadcast(id: string) {
        const token = localStorage.getItem('admin_token');
        return axios.delete(`${API_URL}/admin/broadcasts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async toggleBroadcastStatus(id: string, isActive: boolean) {
        const token = localStorage.getItem('admin_token');
        return axios.patch(`${API_URL}/admin/broadcasts/${id}/status`, { isActive }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // --- Subscription Plans ---
    async getPlans() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/plans`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async createPlan(data: any) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/plans`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async updatePlan(id: string, data: any) {
        const token = localStorage.getItem('admin_token');
        return axios.patch(`${API_URL}/admin/plans/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async deletePlan(id: string) {
        const token = localStorage.getItem('admin_token');
        return axios.delete(`${API_URL}/admin/plans/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // --- Audit Logs ---
    async getAuditLogs() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/audit`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // --- Marketing ---
    async getCampaigns() {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_URL}/admin/marketing/campaigns`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async createCampaign(data: { subject: string; content: string; segment: string }) {
        const token = localStorage.getItem('admin_token');
        return axios.post(`${API_URL}/admin/marketing/campaigns`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
