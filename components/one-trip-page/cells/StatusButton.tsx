import { Button, ButtonProps } from '@heroui/react'
import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/one-trip-page/trip-table.config'
import { Status } from '@/types/types'
import { forwardRef } from 'react'

type Props = {
  status: Status
} & ButtonProps

export const StatusButton = forwardRef<HTMLButtonElement, Props>(
  ({ status, ...props }, ref) => (
    <Button
      ref={ref} // Пробрасываем ref
      {...props} // Передаем остальные пропсы, включая onClick
      className='h-6'
      color={statusColorMap[status]}
      size='sm'
      variant='flat'
    >
      {statusOptionsMap[status]}
    </Button>
  )
)

StatusButton.displayName = 'StatusButton' // Необходимо для React.forwardRef
