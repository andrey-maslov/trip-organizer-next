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
} from '@/components/templates/one-trip-page/trip-table.config'
import { statusTypes } from '@/constants/constants'
import { Status } from '@/types/models'

type StatusCellProps = {
  status: Status
  onUpdate: (value: string) => void
}

const items = statusTypes.map((key) => ({
  key,
  label: statusOptionsMap[key as keyof typeof statusOptionsMap],
}))

export const StatusCell: React.FC<StatusCellProps> = ({ status, onUpdate }) => (
  <div className='flex items-center relative editable-elemenet max-h-[43px]'>
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
        onAction={(value) => onUpdate(value as string)}
        selectedKeys={['bought']}
        aria-label='Dynamic Actions'
        items={items}
      >
        {(item) => (
          <DropdownItem
            className='outline-0'
            key={item.key}
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
