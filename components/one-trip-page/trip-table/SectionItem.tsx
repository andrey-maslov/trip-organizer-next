import { FC } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import clsx from 'clsx'

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

  const sectionCheck = (
    isEnabled: boolean
  ): { className: string; message: string } => {
    if (isEnabled) {
      return {
        className: 'bg-success-400',
        message: 'Section is enabled and calculated',
      }
    }

    // TODO add problems and collisions check here

    return {
      className: 'bg-foreground-400',
      message: 'Section is disabled and not not included in summary',
    }
  }

  return (
    <div
      className={clsx(
        'tr relative bg-white shadow-sm my-1 px-2 rounded-md border-1 border-solid',
        !section.isEnabled
          ? 'opacity-60 border-foreground-100'
          : 'border-foreground-200'
      )}
    >
      <div
        className={clsx(
          'absolute top-1 -left-1 h-3 w-3 rounded-full',
          sectionCheck(section.isEnabled).className
        )}
        title={sectionCheck(section.isEnabled).message}
      />
      {columns.map((column) => (
        <div
          key={column.uid + section.name}
          className='td'
          style={{ width: `${column.width}px` }}
        >
          {column.uid === 'actions' ? (
            <SectionActions
              isEnabled={section.isEnabled}
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
