import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/one-trip-page/trip-table.config'
import { statusTypes } from '@/constants/constants'
import { Status } from '@/types/types'

type StatusCellProps = {
  status: Status
  onUpdate: (value: string) => void
}

const items = statusTypes.map((key) => ({
  key,
  label: statusOptionsMap[key as keyof typeof statusOptionsMap],
}))

export const StatusCell: React.FC<StatusCellProps> = ({ status, onUpdate }) => (
  <div className='flex items-center relative editable-elemenet max-h-[43px] mx-auto'>
    <Dropdown>
      <DropdownTrigger>
        <Button
          size='sm'
          variant='flat'
          color={statusColorMap[status as keyof typeof statusOptionsMap]}
          // isLoading={isPending}
        >
          {statusOptionsMap[status as keyof typeof statusOptionsMap]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Dynamic Actions'
        items={items}
        selectedKeys={['bought']}
        onAction={(value) => onUpdate(value as string)}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            className='outline-0'
            color={statusColorMap[item.key]}
            variant='flat'
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  </div>
)
