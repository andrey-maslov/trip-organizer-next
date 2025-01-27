import React from 'react'
import { Button } from "@heroui/button"
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react"

import { serviceProviderTypes } from '@/constants/constants'
import { SectionTypeIcon } from '@/components/SectionTypeIcon'

type Props = {
  type: string
  onUpdate: (value: string) => void
}

export const TripTypeCell: React.FC<Props> = ({ type, onUpdate }) => {
  return (
    <div className='flex items-center relative editable-elemenet max-h-[43px] mx-auto'>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size='sm'
            variant='light'
            // isLoading={isPending}
          >
            <div className='text-xl text-foreground-400'>
              <SectionTypeIcon type={type} />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Dynamic Actions'
          items={serviceProviderTypes.map((label) => ({ label, value: label }))}
          selectedKeys={['unknown']}
          variant='faded'
          onAction={(value) => {
            onUpdate(value as string)
          }}
        >
          {(item) => (
            <DropdownItem
              key={item.label}
              className='outline-0'
              startContent={<SectionTypeIcon type={item.value} />}
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
