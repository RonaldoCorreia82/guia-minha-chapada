import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Guia Minha Chapada — Encontre seu guia na Chapada Diamantina',
  description:
    'Conectamos turistas a guias locais credenciados da Chapada Diamantina, Bahia. Trilhas, cachoeiras, cânions e travessias.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  )
}
