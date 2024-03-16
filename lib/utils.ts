import { Payment, Section } from '@/types/models'
import { DEFAULT_CURRENCY } from '@/constants/constants'
import { defaultSection } from '@/constants/defaultEntities'

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

export const swapElements = <T>(
  array: T[],
  index: number,
  swapType: 'moveUp' | 'moveDown'
): T[] => {
  if (index === 0 && swapType === 'moveUp') {
    return array
  }

  if (index === array.length - 1 && swapType === 'moveDown') {
    return array
  }
  const tempCurrElem = array[index]

  const index2 = swapType === 'moveDown' ? index + 1 : index - 1

  array[index] = array[index2]
  array[index2] = tempCurrElem

  return array
}

export const getPrice = (payments: Payment[] | null): string => {
  if (!payments || !Array.isArray(payments) || payments.length === 0) {
    return 'n/d'
  }

  const paymentTotalAmount = payments
    .map((payment) => payment?.amount || 0)
    .reduce((a, b) => a + b)

  const currency = payments[0]?.currency || DEFAULT_CURRENCY

  return `${paymentTotalAmount} ${currency}`
}

export const getTotalPriceFromSection = (
  paymentsList: Payment[] | null | undefined
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

export const createNewSection = (
  totalSectionsCount: number,
  initialSection = defaultSection
): Section => ({
  ...initialSection,
  id: (totalSectionsCount + 1).toString(),
})
