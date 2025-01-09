import { getHumanizedTimeDuration } from '@/lib/date'
import { TripPoint } from '@/types/types'

type DurationCellProps = {
  start: TripPoint
  end: TripPoint
}

export const DurationCell: React.FC<DurationCellProps> = ({ start, end }) => {
  const dateTimeStart = start?.dateTime
  const dateTimeEnd = end?.dateTime

  return (
    <div className='flex items-center relative text-center w-full'>
      <div className='text-nowrap w-full'>
        {dateTimeStart && dateTimeEnd
          ? getHumanizedTimeDuration(dateTimeStart, dateTimeEnd)
          : '-'}
      </div>
    </div>
  )
}
