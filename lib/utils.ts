import { CurrencyRates, Expense } from '@/types/types'
import { DEFAULT_CURRENCY } from '@/constants/constants'

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
  paymentsList: Expense[] | null | undefined
): string => {
  if (!paymentsList || paymentsList.length === 0) {
    return '-'
  }

  const paymentTotalAmount = paymentsList
    .map((payment) => payment?.amount || 0)
    .reduce((a, b) => a + b)

  // TODO fix approach of choosing currency inside one section (???)
  // user should chose one currency ... or ...
  const currency = paymentsList[0]?.currency || DEFAULT_CURRENCY

  return `${paymentTotalAmount} ${currency}`
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
  wordLimit: number,
  charLimit = 30
): string => {
  if (typeof sentence !== 'string') {
    return ''
  }
  const words = sentence.split(' ')

  // If the total number of words is within the word limit, process character limits
  const truncatedWords = words.slice(0, wordLimit).map((word) => {
    if (word.length > charLimit) {
      return word.slice(0, charLimit) + '...'
    }

    return word
  })

  const truncatedSentence = truncatedWords.join(' ')

  // Check if the sentence needs truncation based on word count
  if (words.length > wordLimit) {
    return truncatedSentence + '...'
  }

  return truncatedSentence
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
 * @param amount
 * @param currency
 * @param currencyRates
 */
export const convertAmount = (
  amount: number | undefined,
  currency: string | undefined,
  currencyRates: CurrencyRates
): number => {
  if (amount === undefined || !currency || !currencyRates.rates) {
    return 0
  }
  if (currency === currencyRates.base) {
    return amount
  } else {
    // @ts-ignore
    const rate = currencyRates.rates[currency] // Guard ensures currency is defined

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
