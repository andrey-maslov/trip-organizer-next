import { getHumanizedTimeDuration, getNumberOfNightsText } from '@/lib/date'
import { SectionType, TripPoint } from '@/types/types'

type DurationCellProps = {
  start: TripPoint
  end: TripPoint
  sectionType?: SectionType
}

export const DurationCell: React.FC<DurationCellProps> = ({
  start,
  end,
  sectionType,
}) => {
  const dateTimeStart = start?.dateTime
  const dateTimeEnd = end?.dateTime

  const isAccommodation =
    sectionType && ['hotel', 'flat', 'event'].includes(sectionType)

  const output =
    dateTimeStart && dateTimeEnd
      ? isAccommodation
        ? getNumberOfNightsText(dateTimeStart, dateTimeEnd)
        : getHumanizedTimeDuration(dateTimeStart, dateTimeEnd)
      : '-'

  return (
    <div className='flex items-center relative text-center w-full'>
      <div className='text-nowrap w-full'>{output}</div>
    </div>
  )
}
