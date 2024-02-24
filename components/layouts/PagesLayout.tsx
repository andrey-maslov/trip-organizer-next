'use client'

import { Providers } from '@/app/providers'
import { Navbar } from '@/components/layouts/header/Navbar'
import { Link } from '@nextui-org/link'
import { useEffect, useState } from 'react'

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
            <footer className='w-full flex items-center justify-center py-3'>
              <Link
                isExternal
                className='flex items-center gap-1 text-current'
                href='https://nextui-docs-v2.vercel.app?utm_source=next-app-template'
                title='nextui.org homepage'
              >
                <span className='text-default-600'>Powered by</span>
                <p className='text-primary'>NextUI</p>
              </Link>
            </footer>
          </div>
        </Providers>
      ) : (
        <></>
      )}
    </>
  )
}
