import React, { ReactNode } from 'react'
import { FaBus, FaCarSide, FaHotel, FaQuestion, FaTrain } from 'react-icons/fa'
import { ImAirplane } from 'react-icons/im'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { serviceProviderTypes } from '@/constants/constants'

type TypeCellProps = {
  type: string
  onUpdate: (value: string) => void
}

const typeIcons: Record<string, ReactNode> = {
  bus: <FaBus />,
  flight: <ImAirplane />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
}

export const TypeCell: React.FC<TypeCellProps> = ({ type, onUpdate }) => {
  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0'

  return (
    <div className='flex items-center relative editable-elemenet max-h-[43px]'>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size='sm'
            variant='light'
            // isLoading={isPending}
          >
            <div className='text-xl text-foreground-400'>
              {typeIcons[type ?? 'unknown']}
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          // onAction={(value) => onUpdate(value as string)}
          variant='faded'
          selectedKeys={['unknown']}
          aria-label='Dynamic Actions'
          items={serviceProviderTypes.map((label) => ({ label, value: label }))}
        >
          {(item) => (
            <DropdownItem
              startContent={typeIcons[item.value]}
              className='outline-0'
              key={item.label}
              variant='flat'
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
