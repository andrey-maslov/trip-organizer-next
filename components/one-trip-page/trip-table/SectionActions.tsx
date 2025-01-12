import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { FiMoreVertical, FiTrash2, FiPower } from 'react-icons/fi'

import { Section } from '@/types/types'

type Props = {
  isEnabled: boolean
  onSectionDelete: () => void
  onSectionUpdate: (data: Partial<Section>) => void
}

export const SectionActions = ({
  isEnabled,
  onSectionDelete,
  onSectionUpdate,
}: Props) => {
  return (
    <div className='relative flex justify-end items-center gap-2 mx-auto'>
      <Dropdown className='bg-background border-1 border-default-200'>
        <DropdownTrigger>
          <Button isIconOnly size='sm' variant='light'>
            <FiMoreVertical className='text-default-400' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key='disable'
            startContent={
              <FiPower
                className={isEnabled ? 'text-success' : 'text-foreground-500'}
              />
            }
            onPress={() => {
              onSectionUpdate({ isEnabled: !isEnabled })
            }}
          >
            {isEnabled ? 'Disable section' : 'Enable section'}
          </DropdownItem>
          <DropdownItem
            key='delete'
            className='text-danger'
            color='danger'
            startContent={<FiTrash2 className='text-danger' />}
            onPress={onSectionDelete}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
