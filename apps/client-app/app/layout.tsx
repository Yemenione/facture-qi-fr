import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/providers/toast-provider'

import { CookieConsent } from '@/components/cookie-consent'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'Invoicer FR - Client Dashboard',
    description: 'Gérez vos factures simplement.',
    manifest: '/manifest.json',
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr-FR" dir="ltr">
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} style={{ fontVariantNumeric: 'lining-nums' }}>
                <ToastProvider>
                    {children}
                    <CookieConsent />
                </ToastProvider>
            </body>
        </html>
    )
}
