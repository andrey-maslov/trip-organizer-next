import { Format, format, FormatStyle } from '@formkit/tempo'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { getLocalTimeZone } from '@internationalized/date'

import { DEFAULT_LOCALE } from '@/constants/constants'

dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)

export const getFormattedDate = (
  date: Date | string | null | undefined,
  dateFormat: Format = 'full',
  locale?: string
): string => {
  if (!date) {
    return ''
  }

  try {
    return format(date, dateFormat, locale)
  } catch (e) {
    return '';
  }
}

export const isNow = (time1: Date, time2: Date): boolean => {
  if (!time1 || !time2) {
    return false
  }

  return dayjs().isBetween(time1, time2, 'minute')
}

export const isTimeInFuture = (time: Date): boolean => {
  if (!time) {
    return false
  }

  return dayjs().isSameOrBefore(time, 'minute')
}

export const isDateExpired = (
  time: number,
  expirationDuration: number
): boolean => {
  if (!time || !expirationDuration) {
    return true
  }
  const currentTimestamp = Math.floor(Date.now() / 1000) // in seconds

  return time + expirationDuration < currentTimestamp
}

export const getFormattedTime = (
  date: Date | string | null | undefined,
  options: { timeFormat?: FormatStyle; locale?: string; tz?: string }
): string => {
  if (!date) {
    return ''
  }

  // return format(date, { time: timeFormat }, locale)
  return format({
    date,
    format: { time: options.timeFormat ?? 'short' },
    tz: options.tz,
    locale: options.locale ?? DEFAULT_LOCALE,
  })
}

/**
 *
 * @param durationMs Ms
 */
export const timestampToDuration = (durationMs: number): string => {
  // Constants for time units in milliseconds
  const msInMinute = 1000 * 60
  const msInHour = msInMinute * 60
  const msInDay = msInHour * 24
  const msInWeek = msInDay * 7
  const msInYear = msInDay * 365.25 // Accounting for leap years
  const msInMonth = msInYear / 12

  // Calculate years, months, weeks, days, hours, and minutes
  const years = Math.floor(durationMs / msInYear)
  const months = Math.floor((durationMs % msInYear) / msInMonth)
  const weeks = Math.floor((durationMs % msInMonth) / msInWeek)
  const days = Math.floor((durationMs % msInWeek) / msInDay)
  const hours = Math.floor((durationMs % msInDay) / msInHour)
  const minutes = Math.floor((durationMs % msInHour) / msInMinute)

  // Build the result string, including only non-zero units
  let result = ''

  if (years > 0) result += `${years}y `
  if (months > 0) result += `${months}m `
  if (weeks > 0) result += `${weeks}w `
  if (days > 0) result += `${days}d `
  if (hours > 0) result += `${hours}h `
  if (minutes > 0) result += `${minutes}m`

  // Trim any trailing comma or space
  return result.trim().replace(/,\s*$/, '')
}

/**
 * Returns duration between two timestamps or convert duration in to string
 * @param startTime
 * @param endTime
 */
export const getHumanizedTimeDuration = (
  startTime: string,
  endTime: string
): string => {
  // Convert the date-time strings into Date objects
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)

  // Reset the seconds and milliseconds to 00 for both start and end times
  startDate.setSeconds(0, 0)
  endDate.setSeconds(0, 0)

  // Calculate the difference in milliseconds
  const durationMs = endDate.getTime() - startDate.getTime()

  return timestampToDuration(durationMs)
}

/**
 * Returns number of nights between two dates with human-readable format (English)
 * @param checkIn - ISO string for check-in date
 * @param checkOut - ISO string for check-out date
 * @returns A string like "1 night" or "3 nights"
 */
export const getNumberOfNightsText = (
  checkIn: string,
  checkOut: string
): string => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)

  // Clear time to focus only on dates
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  const msPerNight = 1000 * 60 * 60 * 24
  const diffInMs = end.getTime() - start.getTime()
  const nights = Math.max(1, Math.floor(diffInMs / msPerNight))

  return `${nights} night${nights === 1 ? '' : 's'}`
}

export const getTimeZone = () => {
  return getLocalTimeZone() ?? 'UTC'
}

export const parseDateTimeToZoned = () => {}

export function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString || typeof dateString !== 'string') return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}
