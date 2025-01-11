import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { FiMoreVertical } from 'react-icons/fi'

import { Section } from '@/types/types'

type Props = {
  onSectionDelete: () => void
  onSectionUpdate: (data: Partial<Section>) => void
}

export const SectionActions = ({ onSectionDelete, onSectionUpdate }: Props) => {
  return (
    <div className='relative flex justify-end items-center gap-2 mx-auto'>
      <Dropdown className='bg-background border-1 border-default-200'>
        <DropdownTrigger>
          <Button isIconOnly size='sm' variant='light'>
            <FiMoreVertical className='text-default-400' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key='disable'>Disable</DropdownItem>
          <DropdownItem
            key='delete'
            color='danger'
            // variant='solid'
            onPress={onSectionDelete}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
