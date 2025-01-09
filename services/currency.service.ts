import path from 'node:path'

import ky from 'ky'

import { AllExchangeRates, ExchangeRates } from '@/types/types'
import {
  currencies,
  DEFAULT_CURRENCY,
  defaultExchangeRates,
  SECONDS_IN_DAY,
} from '@/constants/constants'
import { safelyParseJSON } from '@/lib/utils'
import { isDateExpired } from '@/lib/date'
import { readFile, saveFile } from '@/services/file.service'

const EXCHANGE_RATES_FILE_NAME = 'exchangeRates.json'
const EXCHANGE_RATES_FILE_PATH = path.join(
  process.cwd(),
  './data/',
  EXCHANGE_RATES_FILE_NAME
)

export const getExchangeRatesUrl = (
  base = DEFAULT_CURRENCY,
  currenciesList: string[] // ISO names list, e.g [EUR, USD, etc]
): string => {
  const currenciesStr = currenciesList
    .filter((curr: string) => curr !== base)
    .join(',')

  return `https://api.apilayer.com/exchangerates_data/latest?base=${base}&symbols=${currenciesStr}`
}

export /**
 * Check time stamp in the object
 * If it was updated more than passed period, we need to fetch data to update in file
 * @param data
 * @param expirationDuration time in seconds to update
 */
const needToUpdateCurrencyRates = (
  data: AllExchangeRates,
  expirationDuration = SECONDS_IN_DAY
): boolean => {
  if (!data) {
    return true
  }

  // Check data
  const presentRatesDate = data?.[DEFAULT_CURRENCY]?.timestamp

  if (!presentRatesDate) {
    return true
  }

  return isDateExpired(presentRatesDate, expirationDuration)
}

export const fetchExchangeRates = async (
  url: string
): Promise<ExchangeRates | null> => {
  if (!process.env.APILAYER_CURRENCY_API_KEY) {
    console.error('You need to add Apilayer API key')

    return null
  }

  const config = {
    headers: {
      apikey: process.env.APILAYER_CURRENCY_API_KEY,
      // Next header fixes the error 'unexpected end of file'
      'Accept-Encoding': 'gzip,deflate,compress',
    },
  }

  try {
    return await ky.get<ExchangeRates>(url, config).json()
  } catch (err: any) {
    console.error('Error when fetch exchange rates: ', err?.message)

    return null
  }
}

export const getExchangeRates = async (
  userCurrency: string
): Promise<ExchangeRates> => {
  // Check - if we have valid data in file
  const str = await readFile(EXCHANGE_RATES_FILE_PATH)
  const data = safelyParseJSON<AllExchangeRates>(str)

  if (!data || needToUpdateCurrencyRates(data)) {
    // Fetch data from API
    console.log('Need to fetch exchange rates')

    const currencyISONames = Object.values(currencies).map(
      (item) => item.nameISO
    )

    // Get only necessary exchange rate
    const exchangeRatesData = await fetchExchangeRates(
      getExchangeRatesUrl(userCurrency, currencyISONames)
    )

    console.log('CURR', exchangeRatesData)

    if (!exchangeRatesData) {
      return defaultExchangeRates
    }

    // Get exchange rates for all supported bases and save in the json file
    Promise.all(
      currencyISONames
        .filter((item) => item !== userCurrency)
        .map((item) =>
          fetchExchangeRates(getExchangeRatesUrl(item, currencyISONames))
        )
    )
      .then((dataList) => {
        const dataForSave = {}

        // Add previously fetched result for avoid extra request
        ;[...dataList, exchangeRatesData].forEach(
          // @ts-ignore
          (item) => (dataForSave[item.base] = item)
        )

        // Save all exchange rates for fast reuse
        saveFile('data', EXCHANGE_RATES_FILE_NAME, dataForSave)
      })
      .catch((err) => console.log('Error all promises', err))

    return exchangeRatesData
  } else {
    const obj = safelyParseJSON<AllExchangeRates>(str)

    // @ts-ignore
    return obj[userCurrency] ?? defaultExchangeRates
  }
}
