import { Sidebar } from "@/components/dashboard/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import ExpertModeBanner from "@/components/ExpertModeBanner"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <div className="hidden md:block">
                <ExpertModeBanner />
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        {/* Header Content could go here */}
                        <div className="ml-auto flex items-center space-x-4">
                            {/* UserNav, Search, etc */}
                        </div>
                    </div>
                </div>
                <div className="flex overflow-hidden bg-slate-50/50 h-[calc(100vh-4rem)]">
                    <aside className="hidden w-64 overflow-y-auto border-r bg-gray-50/40 md:block relative">
                        <Sidebar />
                    </aside>
                    <main className="flex-1 overflow-y-auto p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
