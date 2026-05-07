import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Stock Platform - 股票交易平台',
    description: '专业的股票分析与交易平台',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="zh-CN" className="h-full antialiased dark">
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    )
}
