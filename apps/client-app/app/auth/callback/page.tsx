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
        if (token) {
            localStorage.setItem('access_token', token);
            // Verify token validity by calling checkAuth or fetch user profile if needed
            // For now, assume token is valid and set auth state
            // Ideally we should have a 'verify' endpoint or decode token
            checkAuth();
            router.push('/dashboard');
        } else {
            router.push('/login?error=auth_failed');
        }
    }, [router, searchParams, checkAuth]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Authentification en cours...</p>
            </div>
        </div>
    );
}
