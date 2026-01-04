import axios from 'axios'

// In a real app, use env var
const API_URL = 'http://localhost:3001'

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export interface InvoiceDTO {
    id: string
    invoiceNumber: string
    client: string
    total: number
    status: string
    issueDate: string
}

export const InvoiceService = {
    getAll: async () => {
        const { data } = await api.get<InvoiceDTO[]>('/invoices')
        return data
    },

    create: async (payload: any) => {
        const { data } = await api.post('/invoices', payload)
        return data
    },

    validate: async (id: string) => {
        const { data } = await api.post(`/invoices/${id}/validate`)
        return data
    },

    downloadPdf: async (id: string) => {
        const { data } = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
        return data
    }
}
