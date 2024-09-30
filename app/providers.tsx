'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { EarthoClientProvider } from '@eartho/one-client-nextjs/client'

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
// TODO update Eartho https://github.com/eartho-group/one-client-react/blob/main/examples/nextjs-app/pages/_app.js
const EARTHO_CLIENT_ID = process.env.NEXT_PUBLIC_EARTHO_CLIENT_ID ?? ''

export function Providers({
  children,
  themeProps,
}: PropsWithChildren<ProvidersProps>) {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push}>
      <EarthoClientProvider>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </QueryClientProvider>
      </EarthoClientProvider>
    </NextUIProvider>
  )
}
