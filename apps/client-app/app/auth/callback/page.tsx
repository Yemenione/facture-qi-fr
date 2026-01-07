'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/auth-store';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        const from = searchParams.get('from');

        console.log('[AuthCallback] Token:', token ? 'Present' : 'Missing');
        console.log('[AuthCallback] From:', from);

        if (token) {
            localStorage.setItem('access_token', token);

            // Expert Mode Trigger
            if (from === 'accountant') {
                sessionStorage.setItem('isExpertMode', 'true');
                console.log('[AuthCallback] Expert Mode ACTIVATED');
            } else {
                sessionStorage.removeItem('isExpertMode');
            }

            // Update store with token
            useAuthStore.setState({ token, isAuthenticated: true });

            console.log('[AuthCallback] Redirecting to dashboard...');
            router.push('/dashboard');
        } else {
            console.error('[AuthCallback] No token found, redirecting to login');
            router.push('/login?error=auth_failed');
        }
    }, [router, searchParams]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Authentification en cours...</p>
            </div>
        </div>
    );
}
