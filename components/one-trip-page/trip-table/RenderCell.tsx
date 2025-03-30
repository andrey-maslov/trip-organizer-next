import { Key } from 'react'
import { getKeyValue } from '@heroui/react'

import { DateType, Expense, Section, SectionFE, Status } from '@/types/types'
import { TripTypeCell } from '@/components/one-trip-page/cells/TripTypeCell'
import { NameCell } from '@/components/one-trip-page/cells/NameCell'
import { StatusCell } from '@/components/one-trip-page/cells/StatusCell'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'
import { ServiceProviderCell } from '@/components/one-trip-page/cells/ServiceProviderCell'
import { TripPointCell } from '@/components/one-trip-page/cells/TripPointCell'
import { ExpensesCell } from '@/components/one-trip-page/cells/ExpensesCell'
import { DurationCell } from '@/components/one-trip-page/cells/DurationCell'
import { NoteCell } from '@/components/one-trip-page/cells/NoteCell'
import { defaultPoint } from '@/constants/defaultEntities'

type Props = {
  columnKey: Key
  section: SectionFE
  previousSection?: SectionFE
  tripId: string
  onSave: (data: Partial<Section>) => void
  tripStart: DateType
}

export const RenderCell = ({
  columnKey,
  section,
  previousSection,
  tripId,
  onSave,
  tripStart,
}: Props) => {
  // assertion is here because of types of the function 'getKeyValue'
  const cellValue = getKeyValue(section, columnKey as string | number)

  if (columnKey === 'type') {
    return (
      <TripTypeCell
        type={section.type ?? ''}
        onUpdate={(type) => onSave({ type })}
      />
    )
  }
  if (columnKey === 'name') {
    return (
      <NameCell
        name={section?.name ?? ''}
        onUpdate={(name) => onSave({ name })}
      />
    )
  }
  if (columnKey === 'status') {
    return (
      <StatusCell
        status={cellValue || DEFAULT_SECTION_STATUS}
        onUpdate={(status: Status) => onSave({ status })}
      />
    )
  }
  if (columnKey === 'serviceProvider') {
    return (
      <ServiceProviderCell
        serviceProvider={section.serviceProvider}
        onUpdate={(serviceProvider) => onSave({ serviceProvider })}
      />
    )
  }
  if (columnKey === 'startingPoint') {
    const currentDate = new Date()
    // TODO when setting point after point, local state in not changed, so we dont see the changes that exist in DB
    const prevPoint = previousSection?.endPoint ?? {
      ...defaultPoint,
      dateTime: tripStart ?? currentDate.toISOString(),
    }

    return (
      <TripPointCell
        point={section.startingPoint}
        previousPoint={prevPoint}
        title='Set your starting point'
        onUpdate={(startingPoint) => onSave({ startingPoint })}
      />
    )
  }
  if (columnKey === 'endPoint') {
    const currentDate = new Date()

    const prevPoint = section.startingPoint ?? {
      ...defaultPoint,
      dateTime: tripStart ?? currentDate.toISOString(),
    }
    return (
      <TripPointCell
        point={section.endPoint}
        previousPoint={prevPoint}
        title='Set your finishing point'
        onUpdate={(endPoint) => onSave({ endPoint })}
      />
    )
  }
  if (columnKey === 'payments') {
    return (
      <ExpensesCell
        data={section.payments}
        onSave={(payments) => onSave({ payments } as { payments: Expense[] })}
      />
    )
  }
  if (columnKey === 'duration') {
    return (
      <DurationCell
        end={section.endPoint}
        start={section.startingPoint}
        sectionType={section.type}
      />
    )
  }
  if (columnKey === 'note') {
    return (
      <NoteCell
        noteId={section.note as string}
        sectionId={section._id}
        tripId={tripId}
      />
    )
  }

  return getKeyValue(section, columnKey as string | number)
}
