import { FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'

import { Section, Trip } from '@/types/types'
import { Column } from '@/components/one-trip-page/trip-table.config'
import { RenderCell } from '@/components/one-trip-page/trip-table/RenderCell'
import { SectionActions } from '@/components/one-trip-page/trip-table/SectionActions'
import { deleteSection, updateSection } from '@/queries/queries.db'

type SectionItemProps = {
  columns: Column[]
  section: Section
  trip: Trip
}

export const SectionItem: FC<SectionItemProps> = ({
  section,
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
    <div className='tr'>
      {columns.map((column) => (
        <div
          key={column.uid + section.name}
          className='td'
          style={{ width: `${column.width}px` }}
        >
          {column.uid === 'actions' ? (
            <SectionActions
              onSectionDelete={() =>
                deleteSectionMutation({
                  tripId: trip._id,
                  sectionId: section._id,
                })
              }
              onSectionUpdate={onSectionUpdate}
            />
          ) : (
            <RenderCell
              columnKey={column.uid}
              section={section}
              tripId={trip._id}
              onSave={onSectionUpdate}
            />
          )}
        </div>
      ))}
    </div>
  )
}
