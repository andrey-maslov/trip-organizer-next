import { Format, format, FormatStyle, diffMinutes } from '@formkit/tempo'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

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
  date: Date | string | null,
  timeFormat: FormatStyle = 'short'
): string => {
  if (!date) {
    return ''
  }

  return format(date, { time: timeFormat })
}

/**
 * Returns duration between two timestamps or convert duration in to string
 * @param time1
 * @param time2
 */
export const getHumanizedTimeDuration = (
  time1: Date | string | null | undefined,
  time2?: Date | string | null | undefined
): string | null => {
  if (!time1 || !time2) {
    return null
  }

  let diff = diffMinutes(time2, time1)

  // TODO watch https://github.com/formkit/tempo/pull/66s
  const humanizedDur = dayjs.duration(diff, 'minutes').format('D[d] H[h] m[m]')

  // remove such parts as 0h 0m 0s if it exists
  return humanizedDur.replace(/\b0+[a-z]+\s*/gi, '').trim()
}
