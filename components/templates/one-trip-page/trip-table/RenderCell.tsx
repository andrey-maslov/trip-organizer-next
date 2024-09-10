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
  tripId: string
  onSave: (value: any, sectionId: string, columnKey: string) => void
  onDeleteSection: () => void
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void
}

export const RenderCell = ({
  columnKey,
  section,
  tripId,
  onSave,
  onDeleteSection,
  onMoveSection,
}: Props) => {
  // assertion is here because of types of the function 'getKeyValue'
  const cellValue = getKeyValue(section, columnKey as string | number)

  if (columnKey === 'type') {
    return (
      <TypeCell
        type={section.type ?? ''}
        onUpdate={(newValue) => onSave(newValue, section.id, columnKey)}
      />
    )
  }
  if (columnKey === 'name') {
    return (
      <NameCell
        name={section?.name ?? ''}
        onUpdate={(newValue) => onSave(newValue, section.id, columnKey)}
      />
    )
  }
  if (columnKey === 'status') {
    return (
      <StatusCell
        status={cellValue || DEFAULT_SECTION_STATUS}
        onUpdate={(newValue) => onSave(newValue, section.id, columnKey)}
      />
    )
  }
  if (columnKey === 'serviceProvider') {
    return (
      <ServiceProviderCell
        serviceProvider={section.serviceProvider}
        onUpdate={(newValue) => onSave(newValue, section.id, columnKey)}
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
        onUpdate={(newValue) => onSave(newValue, section.id, columnKey)}
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
        onUpdate={(newValue) => onSave(newValue, section.id, columnKey)}
      />
    )
  }
  if (columnKey === 'payments') {
    return (
      <PaymentsCell
        data={section.payments}
        onSave={(newValue) => onSave(newValue, section.id, columnKey)}
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
        tripId={tripId}
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
            <DropdownItem onPress={() => onMoveSection(section.id, 'up')}>
              Move Up
            </DropdownItem>
            <DropdownItem onPress={() => onMoveSection(section.id, 'down')}>
              Move Down
            </DropdownItem>
            <DropdownItem>Disable</DropdownItem>
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
