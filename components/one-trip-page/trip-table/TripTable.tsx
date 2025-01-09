import { Button, Selection } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { IoMdAdd } from 'react-icons/io'

import { Section, SectionFE, Trip } from '@/types/types'
import { updateSection, updateTrip } from '@/queries/queries.db'
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from '@/components/one-trip-page/trip-table.config'
import { defaultSection } from '@/constants/defaultEntities'
import { SectionItem } from '@/components/one-trip-page/trip-table/SectionItem'
import { SortableList } from '@/components/one-trip-page/trip-table/SortableList'

type Props = {
  trip: Trip
}

export const TripTable = ({ trip }: Props) => {
  const queryClient = useQueryClient()
  const { slug } = useParams()
  const [sectionsToDisplay, setSectionsToDisplay] = useState<SectionFE[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )

  // add 'id' property to process Sections in Front-End
  useEffect(() => {
    setSectionsToDisplay(
      (trip.sections ?? []).map((section) => ({
        ...section,
        id: section._id ?? '',
      }))
    )
  }, [trip.sections])

  // Update Section
  const { mutate: updateSectionMutation } = useMutation({
    mutationFn: (data: { tripId: string; sectionData: Partial<Section> }) =>
      updateSection(data.tripId, data.sectionData),
    onSuccess: async () => {
      toast.success('Section successfully updated')
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Section updating failed')
    },
  })

  // Update Trip
  const { mutate: updateTripMutation } = useMutation({
    mutationFn: updateTrip,
    onSuccess: async () => {
      toast.success('Trip successfully updated!!')
      console.log(slug)
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Trip updating failed')
    },
  })

  const onSectionSave = (
    newValue: any,
    sectionId: string,
    columnKey: string
  ) => {
    if (!newValue || typeof slug !== 'string') {
      return
    }

    // Old section data
    const targetSection = sectionsToDisplay.find(
      (section) => sectionId === section.id
    )

    if (!targetSection) {
      return
    }

    const newSectionData = { ...targetSection, [columnKey]: newValue }

    if (JSON.stringify(newSectionData) === JSON.stringify(targetSection)) {
      return
    }

    updateSectionMutation({ tripId: slug, sectionData: newSectionData })
  }

  const onAddNewSection = () => {
    updateTripMutation({
      _id: trip._id,
      // @ts-ignore
      sections: [...sectionsToDisplay, defaultSection],
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
                style={{ width: `${column.width}px` }}
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
                      onSectionDelete={() => {
                        updateTripMutation({
                          _id: trip._id,
                          sections: sectionsToDisplay.filter(
                            (item) => item.id !== section.id
                          ),
                        })
                      }}
                      onSectionSave={onSectionSave}
                    />
                  </SortableList.Item>
                )}
                onChange={(value) => {
                  setSectionsToDisplay(value)

                  updateTripMutation({
                    _id: trip._id,
                    sections: value,
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
