'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EarthoOneProvider } from '@eartho/one-client-react'
import { PropsWithChildren } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: 1,
    },
  },
})

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'YOUR_API_KEY'

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
      <EarthoOneProvider clientId={EARTHO_CLIENT_ID} domain={''}>
        <APIProvider
          apiKey={API_KEY}
          solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
        >
          <QueryClientProvider client={queryClient}>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </QueryClientProvider>
        </APIProvider>
      </EarthoOneProvider>
    </NextUIProvider>
  )
}
