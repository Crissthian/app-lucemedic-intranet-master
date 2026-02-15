import { ReduxProvider } from '@/redux/provider'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portal Lucemedic',
  description:
    'Portal de gestión médica y seguimiento de salud ocupacional - Lucemedic',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon512_maskable.png'
  }
}

export const viewport: Viewport = {
  themeColor: '#2662F0'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <body suppressHydrationWarning={true} className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
