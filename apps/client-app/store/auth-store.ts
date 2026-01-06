import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/auth.service';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setToken: (token: string) => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => {
                authService.logout();
                set({ user: null, token: null, isAuthenticated: false });
            },
            setToken: (token) => set({ token, isAuthenticated: !!token }),
            checkAuth: () => {
                const currentToken = get().token;
                const isAuth = !!currentToken && authService.isAuthenticated();
                set({ isAuthenticated: isAuth });
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);
