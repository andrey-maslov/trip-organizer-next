import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import {
  DEFAULT_CURRENCY,
  placementTypes,
  transportTypes,
} from '@/constants/constants'
import { Trip, TripSummaryValues } from '@/types/types'
import { timestampToDuration } from '@/lib/date'
import { convertAmount, getSum, round } from '@/lib/utils'
import { getExchangeRates } from '@/services/currency.service'

dayjs.extend(duration)

export const getTripSummaryValues = async (
  trip: Trip | null,
  userCurrency: string = DEFAULT_CURRENCY
): Promise<TripSummaryValues> => {
  if (!trip) {
    return {} as TripSummaryValues
  }

  const { sections, dateTimeStart, dateTimeEnd } = trip

  // Firstly get only necessary currency rates data with base currency chosen by user
  const currency = userCurrency.toUpperCase()

  const exchangeRates = await getExchangeRates(currency)

  // Duration between start trip date and end trip date
  const totalTripTime = dayjs(dateTimeEnd).diff(dayjs(dateTimeStart))

  const roadCostsList: number[] = []
  const stayCostsList: number[] = []
  const roadDurationsList: number[] = []
  const stayDurationsList: number[] = []

  sections.forEach(({ payments, type, startingPoint, endPoint }) => {
    // ROAD
    if (transportTypes.includes(type)) {
      // Payments
      if (payments) {
        payments.forEach(({ amount, currency }) => {
          roadCostsList.push(convertAmount(amount, currency, exchangeRates))
        })
      }

      // Duration
      if (startingPoint.dateTime && endPoint.dateTime) {
        const [time1, time2] = [
          dayjs(startingPoint.dateTime),
          dayjs(endPoint.dateTime),
        ]

        roadDurationsList.push(time2.diff(time1))
      }
    }

    // STAY
    if (placementTypes.includes(type)) {
      // Payments
      if (payments) {
        payments.forEach(({ amount, currency }) => {
          stayCostsList.push(convertAmount(amount, currency, exchangeRates))
        })
      }

      // Duration
      if (startingPoint.dateTime && endPoint.dateTime) {
        const [time1, time2] = [
          dayjs(startingPoint.dateTime),
          dayjs(endPoint.dateTime),
        ]

        stayDurationsList.push(time2.diff(time1))
      }
    }
  })

  const roadCost = getSum(roadCostsList)
  const stayCost = getSum(stayCostsList)
  const roadTimeMs = getSum(roadDurationsList) || 0
  const roadTimeStr = timestampToDuration(roadTimeMs)
  const stayTimeMs = getSum(stayDurationsList) || 0
  const stayTimeStr = timestampToDuration(stayTimeMs)

  return {
    totalTimeMs: roadTimeMs + stayTimeMs,
    totalTimeStr: timestampToDuration(roadTimeMs + stayTimeMs),
    roadTimeMs,
    roadTimeStr,
    stayTimeMs,
    stayTimeStr,
    waitingTimeMs: totalTripTime - roadTimeMs - stayTimeMs,
    waitingTimeStr: timestampToDuration(
      totalTripTime - roadTimeMs - stayTimeMs
    ),
    totalCost: round(roadCost + stayCost, 2),
    roadCost: round(roadCost, 2),
    stayCost: round(stayCost, 2),
    currency,
  }
}
