import { ButtonEdit } from '@/components/ButtonEdit'
import { Chip } from '@nextui-org/react'
import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/templates/one-trip-page/trip-table.config'

type StatusCellProps = {
  status: string
  onEditClick: () => void
}

export const StatusCell: React.FC<StatusCellProps> = ({
  status,
  onEditClick,
}) => (
  <div className='flex items-center relative cell-editable'>
    <Chip
      className='capitalize border-none gap-1 text-default-600'
      color={statusColorMap[status]}
      size='sm'
      variant='flat'
    >
      {statusOptionsMap[status as keyof typeof statusOptionsMap]}
    </Chip>
    <ButtonEdit onClick={() => onEditClick()} />
  </div>
)
