import { ButtonEdit } from '@/components/ButtonEdit'
import { getFormattedDate, getFormattedTime } from '@/lib/date'

type DateTimeCellProps = {
  dateTime: string | null
  onEditClick: () => void
}

export const DateTimeCell: React.FC<DateTimeCellProps> = ({
  dateTime,
  onEditClick,
}) => {
  if (!dateTime) {
    return <div>-</div>
  }

  return (
    <div className='flex items-center relative cell-editable'>
      <div className='flex flex-col'>
        <p className='text-bold text-small capitalize'>
          {getFormattedDate(dateTime)}
        </p>
        <p className='text-bold text-tiny capitalize text-default-500'>
          {getFormattedTime(dateTime)}
        </p>
      </div>
      <ButtonEdit onClick={() => onEditClick()} />
    </div>
  )
}
