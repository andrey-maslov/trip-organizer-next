'use client'

import * as React from 'react'
import { HeroUIProvider } from '@heroui/system'
import { useRouter } from 'next/navigation'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { APIProvider } from '@vis.gl/react-google-maps'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: 1,
    },
  },
})

export interface ProvidersProps {
  themeProps: Partial<ThemeProviderProps>
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'API_KEY'

export function Providers({
  children,
  themeProps,
}: PropsWithChildren<ProvidersProps>) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider {...themeProps}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version={'beta'}>
            {children}
            </APIProvider>
          </NextThemesProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </HeroUIProvider>
  )
}
