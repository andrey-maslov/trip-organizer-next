import { Key } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  getKeyValue,
} from '@nextui-org/react'
import { FiMoreVertical } from 'react-icons/fi'
import { useQueryClient } from '@tanstack/react-query'

import { Section } from '@/types/models'
import { TypeCell } from '@/components/templates/one-trip-page/cells/TypeCell'
import { NameCell } from '@/components/templates/one-trip-page/cells/NameCell'
import { StatusCell } from '@/components/templates/one-trip-page/cells/StatusCell'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'
import { ServiceProviderCell } from '@/components/templates/one-trip-page/cells/ServiceProviderCell'
import { TripPointCell } from '@/components/templates/one-trip-page/cells/TripPointCell'
import { PaymentsCell } from '@/components/templates/one-trip-page/cells/PaymentsCell'
import { DurationCell } from '@/components/templates/one-trip-page/cells/DurationCell'
import { NoteCell } from '@/components/templates/one-trip-page/cells/NoteCell'

type Props = {
  columnKey: Key
  section: Section
  onSaveTableCell: (value: any, sectionId: string, columnKey: string) => void
  onNoteClick: () => void
  onDeleteSection: () => void
}

export const RenderCell = ({
  columnKey,
  section,
  onSaveTableCell,
  onNoteClick,
  onDeleteSection,
}: Props) => {
  // assertion is here because of types of the function 'getKeyValue'
  const cellValue = getKeyValue(section, columnKey as string | number)
  const queryClient = useQueryClient()

  if (columnKey === 'type') {
    return (
      <TypeCell
        type={section.type ?? ''}
        onUpdate={(newValue) =>
          onSaveTableCell(newValue, section.id, columnKey)
        }
      />
    )
  }
  if (columnKey === 'name') {
    return (
      <NameCell
        name={section?.name ?? ''}
        onUpdate={(newValue) =>
          onSaveTableCell(newValue, section.id, columnKey)
        }
      />
    )
  }
  if (columnKey === 'status') {
    return (
      <StatusCell
        status={cellValue || DEFAULT_SECTION_STATUS}
        onUpdate={(newValue) =>
          onSaveTableCell(newValue, section.id, columnKey)
        }
      />
    )
  }
  if (columnKey === 'serviceProvider') {
    return (
      <ServiceProviderCell
        serviceProvider={section.serviceProvider}
        onUpdate={(newValue) =>
          onSaveTableCell(newValue, section.id, columnKey)
        }
      />
    )
  }
  if (columnKey === 'startingPoint') {
    const data = section.startingPoint?.dateTime
      ? section.startingPoint
      : { ...section.startingPoint, dateTime: section.dateTimeStart }

    return (
      <TripPointCell
        initialPoint={data}
        title='Set your starting point'
        onUpdate={(newValue) =>
          onSaveTableCell(newValue, section.id, columnKey)
        }
      />
    )
  }
  if (columnKey === 'endPoint') {
    const data = section.endPoint?.dateTime
      ? section.endPoint
      : { ...section.endPoint, dateTime: section.dateTimeStart }

    return (
      <TripPointCell
        initialPoint={data}
        title='Set your finishing point'
        onUpdate={(newValue) =>
          onSaveTableCell(newValue, section.id, columnKey)
        }
      />
    )
  }
  if (columnKey === 'payments') {
    return (
      <PaymentsCell
        data={section.payments}
        onSave={(newValue) => onSaveTableCell(newValue, section.id, columnKey)}
      />
    )
  }
  if (columnKey === 'duration') {
    return <DurationCell end={section.endPoint} start={section.startingPoint} />
  }
  if (columnKey === 'note') {
    return (
      <NoteCell
        noteId={section.note as string}
        sectionId={section.id}
        onClick={() => onNoteClick()}
      />
    )
  }
  if (columnKey === 'actions') {
    return (
      <div className='relative flex justify-end items-center gap-2'>
        <Dropdown className='bg-background border-1 border-default-200'>
          <DropdownTrigger>
            <Button isIconOnly radius='full' size='sm' variant='light'>
              <FiMoreVertical className='text-default-400' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>View</DropdownItem>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem onPress={() => onDeleteSection()}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }

  return getKeyValue(section, columnKey as string | number)
}
