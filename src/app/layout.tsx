import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/lib/lang-provider'

export const metadata: Metadata = {
  title: 'Mojtaba OS',
  description: 'Personal Operating System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
