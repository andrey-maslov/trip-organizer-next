import { getHumanizedTimeDuration } from '@/lib/date'
import { DateType } from '@/types/models'

type DurationCellProps = {
  dateTimeStart: DateType
  dateTimeEnd: DateType
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
