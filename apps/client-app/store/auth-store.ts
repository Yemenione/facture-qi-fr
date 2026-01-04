import { create } from 'zustand';
import { authService } from '../services/auth.service';

interface User {
    id: string;
    email: string;
    firstName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: () => {
        const isAuth = authService.isAuthenticated();
        set({ isAuthenticated: isAuth });
    }
}));
