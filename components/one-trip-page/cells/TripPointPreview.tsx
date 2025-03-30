import { TripPoint } from '@/types/types'
import { FC } from 'react'
import { truncateSentence } from '@/utils/utils'
import { getFormattedDate, getFormattedTime } from '@/lib/date'

export const TripPointPreview: FC<{ point: TripPoint }> = ({ point }) => {
  const name = point?.place?.name
  const hasDate = Boolean(point?.dateTime)

  if (!name && !hasDate) {
    return <>+</>
  }

  return (
    <>
      {name ? truncateSentence(name, 20) : '-'}
      <br />
      {hasDate ? getFormattedDate(point.dateTime, 'medium') : '-'}
      <br />
      {hasDate
        ? getFormattedTime(point.dateTime, {
            locale: 'ru',
            tz: point?.timeZone,
          })
        : '-'}
    </>
  )
}
