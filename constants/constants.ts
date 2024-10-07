import { CurrencyISOName, CurrencyRates, Status } from '@/types/types'

export const transportTypes = ['bus', 'flight', 'train', 'car', 'ferry']

export const placementTypes = ['hotel', 'flat']

export const statusTypes = [
  'to_find',
  'to_buy',
  'reserved',
  'bought',
  'in_progress',
  'passed',
] as const

export const serviceProviderTypes = [...transportTypes, ...placementTypes]
export const DEFAULT_SECTION_STATUS: Status = 'to_find'
export const DEFAULT_SECTION_TYPE = 'unknown'

export const DEFAUT_LOCALE = 'en'

export const currencyISONames = ['EUR', 'USD', 'PLN', 'BYN'] as const
export const DEFAULT_CURRENCY: CurrencyISOName = 'EUR'

export const currencies: Record<
  CurrencyISOName,
  { name: string; symbol: string; nameISO: CurrencyISOName }
> = {
  EUR: {
    name: 'Euro',
    symbol: '€',
    nameISO: 'EUR',
  },
  USD: {
    name: 'Dollar USA',
    symbol: '$',
    nameISO: 'USD',
  },
  PLN: {
    name: 'Polish Zloty',
    symbol: 'zł',
    nameISO: 'PLN',
  },
  BYN: {
    name: 'Belarusian rouble',
    symbol: 'Br',
    nameISO: 'BYN',
  },
}

export const defaultCurrencyRates: CurrencyRates = {
  success: true,
  timestamp: 1674737763,
  base: 'EUR',
  date: '2023-01-26',
  rates: {
    USD: 1.089788,
    PLN: 10.719783,
    BYN: 2.753763,
  },
}

export const SECONDS_IN_DAY = 86400

export const currencyRatesList: CurrencyRates[] = [
  {
    success: true,
    timestamp: 1674737763,
    base: 'USD',
    date: '2023-01-26',
    rates: {
      EUR: 0.91757, // 1 / 1.089788 (inverse of EUR to USD rate)
      PLN: 9.835225, // 10.719783 / 1.089788 (PLN to USD conversion)
      BYN: 2.527327, // 2.753763 / 1.089788 (BYN to USD conversion)
    },
  },
  {
    success: true,
    timestamp: 1674737763,
    base: 'PLN',
    date: '2023-01-26',
    rates: {
      EUR: 0.09331, // 1 / 10.719783 (inverse of EUR to PLN rate)
      USD: 0.10166, // 1 / 9.835225 (PLN to USD rate)
      BYN: 0.25696, // 2.753763 / 10.719783 (BYN to PLN conversion)
    },
  },
  {
    success: true,
    timestamp: 1674737763,
    base: 'BYN',
    date: '2023-01-26',
    rates: {
      EUR: 0.36312, // 1 / 2.753763 (inverse of EUR to BYN rate)
      USD: 0.39555, // 1 / 2.527327 (BYN to USD conversion)
      PLN: 3.89228, // 1 / 0.25696 (BYN to PLN conversion)
    },
  },
]
