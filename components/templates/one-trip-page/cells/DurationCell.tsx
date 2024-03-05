import { getHumanizedTimeDuration } from '@/lib/date'

type DurationCellProps = {
  dateTimeStart: string | null
  dateTimeEnd: string | null
}

export const DurationCell: React.FC<DurationCellProps> = ({
  dateTimeStart,
  dateTimeEnd,
}) => (
  <div className='flex items-center relative'>
    <div className='text-nowrap'>
      {dateTimeStart && dateTimeEnd
        ? getHumanizedTimeDuration(dateTimeStart, dateTimeEnd)
        : '-'}
    </div>
  </div>
)
