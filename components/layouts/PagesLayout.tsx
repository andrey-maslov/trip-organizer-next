'use client'

import { Providers } from '@/app/providers'
import { Navbar } from '@/components/layouts/header/Navbar'
import { useEffect, useState } from 'react'
import { Divider } from '@nextui-org/divider'

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
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className='relative flex flex-col h-screen'>
            <Navbar />
            <main className='container mx-auto max-w-7xl pt-16 px-6 flex-grow'>
              {children}
            </main>
            <Divider />
            <footer className='w-full flex items-center justify-center py-4'>
              <span className='flex items-center gap-1 text-sm text-foreground-500'>
                Trip Organizer © 2024
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
