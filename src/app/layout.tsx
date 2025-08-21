import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/shared/ui/Toast'
import { AuthProvider } from '@/shared/auth/AuthContext'
import { QueryProvider } from '@/shared/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uirapuru - Sistema de Monitoramento de Usinas Fotovoltaicas',
  description: 'Sistema moderno para visualização, gestão e monitoramento de dados de usinas solares fotovoltaicas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}