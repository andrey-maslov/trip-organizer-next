import { Button } from '@heroui/react'
import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/one-trip-page/trip-table.config'
import { Status } from '@/types/types'

type Props = {
  status: Status
}

export const StatusButton = ({ status }: Props) => {
  return (
    <Button
      disabled
      className='h-6 ml-7'
      color={statusColorMap[status]}
      size='sm'
      variant='flat'
    >
      {statusOptionsMap[status]}
    </Button>
  )
}
