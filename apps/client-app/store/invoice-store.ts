import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InvoiceState {
    draft: any | null
    setDraft: (data: any) => void
    clearDraft: () => void
}

export const useInvoiceStore = create<InvoiceState>()(
    persist(
        (set) => ({
            draft: null,
            setDraft: (data) => set({ draft: data }),
            clearDraft: () => set({ draft: null }),
        }),
        {
            name: 'invoice-draft-storage',
        }
    )
)
