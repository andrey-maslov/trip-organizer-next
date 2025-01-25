'use client'

import { useEffect, useState } from 'react'
import { Divider } from "@heroui/divider"

import { Providers } from '@/app/providers'
import { Navbar } from '@/components/layouts/header/Navbar'
import ErrorBoundary from '@/components/ErrorBoundary'

type PagesLayoutProps = {
  children: React.ReactNode
}

export const PagesLayout = ({ children }: PagesLayoutProps) => {
  const [isClient, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  return (
    <>
      {isClient ? (
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className='relative flex flex-col h-screen max-w-[100%]'>
            <Navbar />
            <main className='container mx-auto max-w-7xl py-8 xl:py-16 px-4 xl:px-6 flex-grow'>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Divider />
            <footer className='w-full flex items-center justify-center py-4'>
              <span className='flex items-center gap-1 text-sm text-foreground-500'>
                Trip Organizer © 2025
              </span>
            </footer>
          </div>
        </Providers>
      ) : (
        <></>
      )}
    </>
  )
}
