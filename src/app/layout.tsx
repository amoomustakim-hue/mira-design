import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mira | Customer service for your business, day and night',
  description: 'A 24/7 assistant on your website that answers only from your own catalog, policies and orders, plus order tracking and insights. ₦50,000/month.',
  metadataBase: new URL('https://miraapp.com.ng'),
}

export const viewport: Viewport = {
  themeColor: '#ececec',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
