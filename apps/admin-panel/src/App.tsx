import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import CompaniesList from './pages/CompaniesList'
import SubscriptionManager from './pages/SubscriptionManager'
import Login from './pages/Login'
import { RequireSuperAdmin } from './auth/RequireSuperAdmin'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<RequireSuperAdmin />}>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/companies" element={<CompaniesList />} />
                    <Route path="/subscriptions" element={<SubscriptionManager />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
