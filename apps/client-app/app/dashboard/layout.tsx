import { Sidebar } from "@/components/dashboard/sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import ExpertModeBanner from "@/components/ExpertModeBanner"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-brand-dark text-white flex flex-col md:block">

                {/* Desktop Header Wrapper */}
                <div className="hidden md:block">
                    <ExpertModeBanner />
                    <div className="border-b border-white/10">
                        <div className="flex h-16 items-center px-4">
                            {/* Header Content could go here */}
                            <div className="ml-auto flex items-center space-x-4">
                                {/* UserNav, Search, etc */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-40 bg-brand-dark border-b border-white/10">
                    <ExpertModeBanner />
                    <div className="flex h-14 items-center px-4 justify-between">
                        <span className="font-heading font-bold text-brand-gold tracking-tight">Invoicer FR</span>
                        {/* Optional: Mobile User Menu/Avatar could go here */}
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden h-screen md:h-[calc(100vh-4rem)]">
                    <aside className="hidden w-64 overflow-y-auto border-r border-white/10 bg-brand-dark md:block relative">
                        <Sidebar />
                    </aside>
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-brand-dark pb-24 md:pb-8">
                        {children}
                    </main>
                </div>

                <MobileNav />
            </div>
        </AuthGuard>
    )
}
