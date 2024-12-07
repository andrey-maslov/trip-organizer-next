'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClerkProvider } from '@clerk/nextjs'

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

export function Providers({
  children,
  themeProps,
}: PropsWithChildren<ProvidersProps>) {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push}>
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </NextUIProvider>
  )
}
