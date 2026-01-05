import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: 'Invoicer FR - Client Dashboard',
    description: 'Gérez vos factures simplement.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr-FR" dir="ltr">
            <body className={inter.className} style={{ fontVariantNumeric: 'lining-nums' }}>{children}</body>
        </html>
    )
}
