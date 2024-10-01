import { Format, format, FormatStyle } from '@formkit/tempo'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getLocalTimeZone } from '@internationalized/date'

import { DEFAUT_LOCALE } from '@/constants/constants'

dayjs.extend(duration)

export const getFormattedDate = (
  date: Date | string | null | undefined,
  dateFormat: Format = 'full',
  locale?: string
): string => {
  if (!date) {
    return ''
  }

  return format(date, dateFormat, locale)
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
    locale: options.locale ?? DEFAUT_LOCALE,
  })
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

export const getTimeZone = () => {
  return getLocalTimeZone() ?? 'UTC'
}

export const parseDateTimeToZoned = () => {}
