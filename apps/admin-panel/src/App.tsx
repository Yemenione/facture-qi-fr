import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import CompaniesList from './pages/CompaniesList'
import SubscriptionManager from './pages/SubscriptionManager'
import Login from './pages/Login'
import BackupsPage from './pages/BackupsPage'
import SettingsPage from './pages/SettingsPage'
import ActivityLog from './pages/ActivityLog'
import UsersList from './pages/UsersList'
import HealthStatus from './pages/HealthStatus'
import VerificationCenter from './pages/VerificationCenter'
import SupportTickets from './pages/SupportTickets'
import Broadcasts from './pages/Broadcasts'
import { RequireSuperAdmin } from './auth/RequireSuperAdmin'
import AdminLayout from './components/layout/AdminLayout'
import MarketingCenter from './pages/MarketingCenter'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<RequireSuperAdmin />}>
                    {/* Wrap authenticated routes in AdminLayout */}
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/companies" element={<CompaniesList />} />
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/status" element={<HealthStatus />} />
                        <Route path="/verification" element={<VerificationCenter />} />
                        <Route path="/support" element={<SupportTickets />} />
                        <Route path="/broadcasts" element={<Broadcasts />} />
                        <Route path="/activity" element={<ActivityLog />} />
                        <Route path="/marketing" element={<MarketingCenter />} />
                        <Route path="/subscriptions" element={<SubscriptionManager />} />

                        {/* Placeholders for new routes */}
                        <Route path="/activity" element={<ActivityLog />} />
                        <Route path="/settings/general" element={<SettingsPage />} />
                        <Route path="/settings/security" element={<div className="p-8">Security Settings</div>} />
                        <Route path="/settings/backups" element={<BackupsPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
