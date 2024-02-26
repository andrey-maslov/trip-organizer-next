import { format } from '@formkit/tempo'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

type Time = number | string | undefined | null | dayjs.Dayjs

export const getFormattedDate = (
  date: Date | string | null,
  dateFormat?: string
): string => {
  if (!date) {
    return ''
  }
  if (dateFormat) {
    // TODO add correct rule
    return ''
  }
  return format(date, 'full')
}

export const getFormattedTime = (
  date: Date | string | null,
  timeFormat?: string
): string => {
  if (!date) {
    return ''
  }
  if (timeFormat) {
    // TODO add correct rule
    return ''
  }
  return format(date, { time: 'short' })
}

/**
 * Returns duration between two timestamps or convert duration in ms to string
 * @param time1 - dayjs object or time in ms,
 * @param time2 - dayjs object or time in ms
 */
export const getHumanizedTimeDuration = (
  time1: Time,
  time2?: Time | undefined
): string => {
  const _time1 = dayjs(time1)
  const _time2 = time2 ? dayjs(time2) : null

  if (!_time1.isValid()) {
    return ''
  }

  let diff = 0

  if (typeof time1 === 'number' && !_time2) {
    diff = time1
  } else if (_time1 && _time2) {
    diff = _time2.diff(_time1)
  }

  const humanizedDur = dayjs
    .duration(diff, 'millisecond')
    .format('D[d] H[h] m[m]')
  // remove such parts as 0h 0m 0s if it exists
  return humanizedDur.replace(/\b0+[a-z]+\s*/gi, '').trim()
}
