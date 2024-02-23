'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EarthoOneProvider } from '@eartho/one-client-react'

const queryClient = new QueryClient()

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

const EARTHO_CLIENT_ID = process.env.NEXT_PUBLIC_EARTHO_CLIENT_ID ?? ''

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push}>
      <EarthoOneProvider clientId={EARTHO_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </QueryClientProvider>
      </EarthoOneProvider>
    </NextUIProvider>
  )
}
