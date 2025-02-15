import { Key } from 'react'
import { getKeyValue } from '@heroui/react'

import { Expense, Section, SectionFE, Status } from '@/types/types'
import { TripTypeCell } from '@/components/one-trip-page/cells/TripTypeCell'
import { NameCell } from '@/components/one-trip-page/cells/NameCell'
import { StatusCell } from '@/components/one-trip-page/cells/StatusCell'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'
import { ServiceProviderCell } from '@/components/one-trip-page/cells/ServiceProviderCell'
import { TripPointCell } from '@/components/one-trip-page/cells/TripPointCell'
import { ExpensesCell } from '@/components/one-trip-page/cells/ExpensesCell'
import { DurationCell } from '@/components/one-trip-page/cells/DurationCell'
import { NoteCell } from '@/components/one-trip-page/cells/NoteCell'

type Props = {
  columnKey: Key
  section: SectionFE
  tripId: string
  onSave: (data: Partial<Section>) => void
}

export const RenderCell = ({ columnKey, section, tripId, onSave }: Props) => {
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
    const data = section.startingPoint

    return (
      <TripPointCell
        initialPoint={data}
        title='Set your starting point'
        onUpdate={(startingPoint) => onSave({ startingPoint })}
      />
    )
  }
  if (columnKey === 'endPoint') {
    const data = section.endPoint

    return (
      <TripPointCell
        initialPoint={data}
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
    return <DurationCell end={section.endPoint} start={section.startingPoint} />
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
