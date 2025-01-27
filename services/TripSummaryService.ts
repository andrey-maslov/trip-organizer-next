import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import {
  DEFAULT_CURRENCY,
  placementTypes,
  transportTypes,
} from '@/constants/constants'
import { ExchangeRates, Section, Trip, TripSummaryValues } from '@/types/types'
import { timestampToDuration } from '@/lib/date'
import { convertAmount, getSum, round } from '@/lib/utils'

dayjs.extend(duration)


type Summary = {
  cost: number;
  duration: number;
  baseCurrency: string;
}

/**
 *
 * @param sections trip section that you'd like to summarize
 * @param exchangeRates currency and exchange rates data
 * @param filterTypes types of section you'd like to summarize (serviceProviderTypes). If types = [] -> all section, even without type defined will be processed
 */
export const getSummaryByType = (sections: Section[], exchangeRates: ExchangeRates, filterTypes: string[],): Summary => {

  // Initiation
  const costs: number[] = []
  const durations: number[] = []

  sections.forEach(
    ({ payments, type, startingPoint, endPoint, isEnabled }) => {
      if (!isEnabled) {
        return
      }

      if (filterTypes.length > 0 && !filterTypes.includes(type)) return

      // Payments
      payments?.forEach(({ amount, currency }) => {
        costs.push(convertAmount(amount, currency, exchangeRates))
      })

      // Duration
      if (startingPoint?.dateTime && endPoint?.dateTime) {
        const start = dayjs(startingPoint.dateTime)
        const end = dayjs(endPoint.dateTime)
        durations.push(end.diff(start))
      }
    }
  )

  return {
    cost: getSum(costs),
    duration: getSum(durations),
    baseCurrency: exchangeRates.base
  }
}

export const getTripSummaryValues = (
  trip: Trip | null,
  userCurrency: string = DEFAULT_CURRENCY
): TripSummaryValues => {
  if (!trip) {
    return {} as TripSummaryValues
  }

  try {
    const { sections, exchangeRates, dateTimeStart, dateTimeEnd } = trip

    // Firstly get only necessary currency rates data with base currency chosen by user
    const currency = userCurrency.toUpperCase()

    // Duration between start trip date and end trip date
    const totalTripTime =
      (dateTimeStart && dateTimeEnd)
        ? dayjs(dateTimeEnd).diff(dayjs(dateTimeStart))
        : 0

    const road = getSummaryByType(sections, exchangeRates, transportTypes)
    const stay = getSummaryByType(sections, exchangeRates, placementTypes)
    const total = getSummaryByType(sections, exchangeRates, [])

    return {
      totalTimeMs: total.duration,
      totalTimeStr: timestampToDuration(total.duration),
      roadTimeMs: road.duration,
      roadTimeStr: timestampToDuration(road.duration),
      stayTimeMs: stay.duration,
      stayTimeStr: timestampToDuration(stay.duration),
      waitingTimeMs: totalTripTime - road.duration - stay.duration,
      waitingTimeStr: timestampToDuration(
        totalTripTime - road.duration - stay.duration
      ),
      totalCost: round(total.cost, 0),
      roadCost: round(road.cost, 0),
      stayCost: round(stay.cost, 0),
      currency,
    }
  } catch (e) {
    return {} as TripSummaryValues
  }
}
