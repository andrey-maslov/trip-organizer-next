import React, { FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import clsx from 'clsx'

import { Section, SectionFE, Trip } from '@/types/types'
import { Column } from '@/components/one-trip-page/trip-table.config'
import { RenderCell } from '@/components/one-trip-page/trip-table/RenderCell'
import { SectionActions } from '@/components/one-trip-page/trip-table/SectionActions'
import { deleteSection, updateSection } from '@/queries/queries.db'
import { DragHandle } from '@/components/one-trip-page/trip-table/SortableItem'

type SectionItemProps = {
  columns: Column[]
  section: SectionFE
  previousSection?: SectionFE
  trip: Trip
}

export const SectionItem: FC<SectionItemProps> = ({
  section,
  previousSection,
  columns,
  trip,
}) => {
  const queryClient = useQueryClient()
  const { slug } = useParams()

  // Update Section mutation
  const { mutate: updateSectionMutation } = useMutation({
    mutationFn: (data: { tripId: string; data: Partial<Section> }) =>
      updateSection(data.tripId, data.data),
    onSuccess: async () => {
      toast.success('Section successfully updated')
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
      await queryClient.invalidateQueries({ queryKey: ['summary', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Section updating failed')
    },
  })

  // Delete Section mutation
  const { mutate: deleteSectionMutation } = useMutation({
    mutationFn: (data: { tripId: string; sectionId: string }) =>
      deleteSection(data.tripId, data.sectionId),
    onSuccess: async () => {
      toast.success('Section successfully deleted')
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Section deletion failed')
    },
  })

  if (typeof slug !== 'string') {
    return <div>Slug of trip ID in URL is not simple string</div>
  }

  const onSectionUpdate = (newValue: any) =>
    updateSectionMutation({
      tripId: trip._id,
      data: { _id: section._id, ...newValue },
    })

  return (
    <div
      className={clsx(
        'tr relative bg-white shadow-sm my-1 px-2 rounded-md border-2 border-solid ',
        !section.isEnabled
          ? 'opacity-95 border-foreground-300 scale-90 text-foreground-500'
          : 'border-yellow-400'
      )}
    >
      <DragHandle />
      {columns.map((column) => (
        <div
          key={column.uid + section.name}
          className='td bg-white'
          style={{ width: `${column.width}px`, maxWidth: `${column.width}px` }}
        >
          {column.uid === 'actions' ? (
            <SectionActions
              isEnabled={section.isEnabled}
              onSectionDelete={() => {
                if (!section._id) {
                  return
                }

                deleteSectionMutation({
                  tripId: trip._id,
                  sectionId: section._id,
                })
              }}
              onSectionUpdate={onSectionUpdate}
            />
          ) : (
            <RenderCell
              columnKey={column.uid}
              section={section}
              previousSection={previousSection}
              tripId={trip._id}
              onSave={onSectionUpdate}
              tripStart={trip.dateTimeStart}
            />
          )}
        </div>
      ))}
    </div>
  )
}
