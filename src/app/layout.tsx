import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/lib/lang-provider'

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-vazir',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mojtaba OS',
  description: 'Personal Operating System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
