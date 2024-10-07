import path from 'node:path'

import ky from 'ky'

import { AllCurrencyRates, CurrencyISOName, CurrencyRates } from '@/types/types'
import {
  currencyISONames,
  DEFAULT_CURRENCY,
  defaultCurrencyRates,
  SECONDS_IN_DAY,
} from '@/constants/constants'
import { safelyParseJSON } from '@/lib/utils'
import { isDateExpired } from '@/lib/date'
import { readFile, saveFile } from '@/services/file.service'

const CURRENCY_DATA_FILE_NAME = 'currencyRates.json'
const CURRENCY_DATA_FILE_PATH = path.join(
  process.cwd(),
  './data/',
  CURRENCY_DATA_FILE_NAME
)

export const getCurrencyRatesUrl = (
  base: CurrencyISOName = DEFAULT_CURRENCY,
  currenciesList = currencyISONames
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
  data: AllCurrencyRates,
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

export const fetchCurrencyRates = async (
  url: string
): Promise<CurrencyRates | null> => {
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
    return await ky.get<CurrencyRates>(url, config).json()
  } catch (err: any) {
    console.error('Error when fetch currency rates: ', err?.message)

    return null
  }
}

export const getCurrencyRates = async (
  userCurrency: CurrencyISOName
): Promise<CurrencyRates> => {
  // Check - if we have valid data in file
  const str = await readFile(CURRENCY_DATA_FILE_PATH)
  const data = safelyParseJSON<AllCurrencyRates>(str)

  if (!data || needToUpdateCurrencyRates(data)) {
    // Fetch data from API
    console.log('Need to fetch currency rates')

    const currencyRates = await fetchCurrencyRates(
      getCurrencyRatesUrl(userCurrency)
    )

    console.log('CURR', currencyRates)

    if (!currencyRates) {
      return defaultCurrencyRates
    }

    // Asynchronously Get data with all currencies as base to file(
    Promise.all(
      currencyISONames
        .filter((item) => item !== userCurrency)
        .map((item) => fetchCurrencyRates(getCurrencyRatesUrl(item)))
    )
      .then((dataList) => {
        const dataForSave = {}

        // Add previously fetched result for avoid extra request
        ;[...dataList, currencyRates].forEach(
          // @ts-ignore
          (item) => (dataForSave[item.base] = item)
        )

        // Save all rates
        saveFile('data', 'currencyRates.json', dataForSave)
      })
      .catch((err) => console.log('Error all promises', err))

    return currencyRates
  } else {
    const obj = safelyParseJSON<AllCurrencyRates>(str)

    // @ts-ignore
    return obj[userCurrency]
  }
}
