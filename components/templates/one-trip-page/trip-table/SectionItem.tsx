import { FC } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { FiMoreVertical } from 'react-icons/fi'

import { Section, Trip } from '@/types/types'
import { Column } from '@/components/templates/one-trip-page/trip-table.config'
import { RenderCell } from '@/components/templates/one-trip-page/trip-table/RenderCell'

type SectionItemProps = {
  columns: Column[]
  section: Section
  trip: Trip
  onSectionSave: (newValue: any, sectionId: string, columnKey: string) => void
  onSectionDelete: () => void
}

export const SectionItem: FC<SectionItemProps> = ({
  section,
  columns,
  trip,
  onSectionSave,
  onSectionDelete,
}) => {
  return (
    <div className='tr bg-white shadow-md my-1'>
      {columns.map((column) => (
        <div
          key={column.uid + section.name}
          className='td'
          style={{ width: `${column.width}px` }}
        >
          {column.uid === 'actions' ? (
            <div className='relative flex justify-end items-center gap-2'>
              <Dropdown className='bg-background border-1 border-default-200'>
                <DropdownTrigger>
                  <Button isIconOnly radius='full' size='sm' variant='light'>
                    <FiMoreVertical className='text-default-400' />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key='disable'>Disable</DropdownItem>
                  <DropdownItem key='delete' onPress={onSectionDelete}>
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <RenderCell
              columnKey={column.uid}
              section={section}
              tripId={trip._id}
              onSave={onSectionSave}
            />
          )}
        </div>
      ))}
    </div>
  )
}
