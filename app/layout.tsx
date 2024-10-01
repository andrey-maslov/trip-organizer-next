import type { Metadata } from 'next'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css'

import clsx from 'clsx'
import { ToastContainer } from 'react-toastify'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/config/fonts'
import { PagesLayout } from '@/components/layouts/PagesLayout'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <PagesLayout>{children}</PagesLayout>
        <ToastContainer />
      </body>
    </html>
  )
}
