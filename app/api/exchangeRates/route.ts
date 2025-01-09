import { NextRequest } from 'next/server'

import { getExchangeRates } from '@/services/currency.service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currencyISO = searchParams.get('baseCurrency')

  if (!currencyISO) {
    return new Response('Provide base currency in search params', {
      status: 500,
    })
  }

  // Get one trip
  try {
    const exchangeRates = await getExchangeRates(currencyISO)

    return Response.json(exchangeRates)
  } catch (e) {
    return new Response('Exchange rates error', {
      // TODO add 500 and 404 separation
      status: 500,
    })
  }
}
