import { ExchangeRates, Expense, Section } from '@/types/types'
import { placementTypes, transportTypes } from '@/constants/constants'
import dayjs from 'dayjs'

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const convertArrayToObject = <T>(
  array: T[],
  key: string
): Record<string, T> => {
  // if (!array || !Array.isArray(array)) {
  //   return null;
  // }

  const initialValue = {}

  return array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key as keyof typeof obj]]: item,
    }),
    initialValue
  )
}

// export const getClosesSectionStart = (
//   sections: Section[]
// ): { sectionName: string; countdownValue: countdownValueType } => {
//   if (!sections || !Array.isArray(sections) || sections.length === 0) {
//     return {
//       sectionName: '',
//       countdownValue: 0,
//     }
//   }
//
//   let sectionName = ''
//   let countdownValue: number | string = 0
//
//   try {
//     for (let i = 0; i < sections.length; i++) {
//       if (
//         sections[i].dateTimeStart &&
//         isTimeInFuture(sections[i].dateTimeStart)
//       ) {
//         sectionName = sections[i].name || ''
//         countdownValue = sections[i].dateTimeStart || 0
//         break
//       }
//     }
//     return {
//       sectionName,
//       countdownValue,
//     }
//   } catch (e) {
//     return {
//       sectionName,
//       countdownValue,
//     }
//   }
// }

export const getTotalPriceFromSection = (
  paymentsList: Expense[] | null | undefined,
  exchangeRates: ExchangeRates | undefined
): string => {
  if (!paymentsList || paymentsList.length === 0 || !exchangeRates) {
    return '0'
  }

  const paymentTotalAmount = paymentsList
    .map((payment) =>
      convertAmount(payment?.amount, payment.currency, exchangeRates)
    )
    .reduce((a, b) => a + b)

  return `${paymentTotalAmount.toFixed()} ${exchangeRates.base}`
}

export const safelyParseJSON = <T>(json: unknown): T | null => {
  if (typeof json !== 'string') {
    return null
  }
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export const safelyStringifyJSON = <T>(data: T): string => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    return '{}'
  }
}

export const isEmptyObject = (object: unknown) => {
  if (!object) {
    return true
  }
  for (const property in object) {
    return false
  }

  return true
}

export const truncateSentence = (
  sentence: unknown,
  charLimit = 20
): string => {
  if (typeof sentence !== 'string') {
    return ''
  }

  return sentence.substring(0, charLimit) + (sentence.length > charLimit && '...')
}

/**
 * Numbers array => sum
 * @param list
 */
export const getSum = (list: number[]): number => {
  return list.length > 0 ? list.reduce((a, b) => a + b) : 0
}

/**
 * Convert amount from one currency to base (user) currency
 * @param amount in current currency
 * @param currency target convert
 * @param exchangeRates with the 'currency' as a base
 */
export const convertAmount = (
  amount: number | undefined,
  currency: string | undefined,
  exchangeRates: ExchangeRates | undefined
): number => {
  if (amount === undefined || !currency || !exchangeRates?.rates) {
    return 0
  }
  if (currency === exchangeRates.base) {
    return amount
  } else {
    // @ts-ignore
    const rate = exchangeRates.rates[currency] // Guard ensures currency is defined

    if (rate === undefined) {
      throw new Error(`Rate for currency ${currency} is not available.`)
    }
    const result = amount / rate

    return round(result, 2)
  }
}

export const round = (num: number, digits = 0): number => {
  return +num.toFixed(digits) || 0
}
