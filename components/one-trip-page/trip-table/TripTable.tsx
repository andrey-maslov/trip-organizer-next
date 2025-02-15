import { Button } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { IoMdAdd } from 'react-icons/io'

import { Section, SectionFE, Trip } from '@/types/types'
import { updateTrip } from '@/queries/queries.db'
import { columns } from '@/components/one-trip-page/trip-table.config'
import { SectionItem } from '@/components/one-trip-page/trip-table/SectionItem'
import { SortableList } from '@/components/one-trip-page/trip-table/SortableList'
import { defaultSection } from '@/constants/defaultEntities'

type Props = {
  trip: Trip
}

export const TripTable = ({ trip }: Props) => {
  const queryClient = useQueryClient()
  const { slug } = useParams()
  const [sectionsToDisplay, setSectionsToDisplay] = useState<SectionFE[]>([])

  // add 'id' property to process Sections in Front-End
  useEffect(() => {
    setSectionsToDisplay(
      trip.sections.map((section) => ({
        ...section,
        id: section?._id ?? '',
      }))
    )
  }, [trip.sections])

  // Update Trip mutation
  const { mutate: updateTripMutation } = useMutation({
    mutationFn: updateTrip,
    onSuccess: async () => {
      toast.success('Trip successfully updated!!')
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Trip updating failed')
    },
  })

  const onAddNewSection = () => {
    updateTripMutation({
      _id: trip._id,
      sections: [...sectionsToDisplay, defaultSection] as Section[],
    })
  }

  return (
    <>
      <div className='table-wrapper'>
        <div className='table'>
          <div className='thead bg-default-100'>
            {columns.map((column) => (
              <div
                key={column.uid}
                className='th justify-center'
                style={{
                  width: `${column.width}px`,
                  maxWidth: `${column.width}px`,
                }}
              >
                <span>{column.name}</span>
              </div>
            ))}
          </div>
          <div className='tbody'>
            {sectionsToDisplay?.length > 0 ? (
              <SortableList
                items={sectionsToDisplay}
                renderItem={(section) => (
                  <SortableList.Item id={section.id}>
                    <SectionItem
                      key={section.id}
                      columns={columns}
                      section={section}
                      trip={trip}
                    />
                  </SortableList.Item>
                )}
                onChange={(value) => {
                  setSectionsToDisplay(value)

                  updateTripMutation({
                    _id: trip._id,
                    sections: value as Section[],
                  })
                }}
              />
            ) : (
              <div className='text-center py-10'>
                <div className='mb-8'>You don&apos;t have any trip section</div>
                <Button color='primary' onPress={onAddNewSection}>
                  Create first
                </Button>
              </div>
            )}
          </div>
        </div>

        {sectionsToDisplay.length > 0 && (
          <div className='py-3 flex justify-center'>
            <Button
              isIconOnly
              className='bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white text-xl shadow-md'
              title='Add new section'
              onPress={onAddNewSection}
            >
              <IoMdAdd />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
