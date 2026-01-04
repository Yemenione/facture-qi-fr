import { Navigate, Outlet } from 'react-router-dom'

// Mock Auth Hook for scaffolding
function useAuth() {
    return { user: { role: 'SUPER_ADMIN' }, isLoading: false }
}

export function RequireSuperAdmin() {
    const { user, isLoading } = useAuth()

    if (isLoading) return <div>Chargement...</div>

    if (!user || user.role !== 'SUPER_ADMIN') {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
