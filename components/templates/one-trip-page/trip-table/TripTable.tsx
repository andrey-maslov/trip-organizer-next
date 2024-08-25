import { Button, Selection } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { createNewSection } from '@/lib/utils'
import { Section, Trip } from '@/types/models'
import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'
import { updateSection, updateTrip } from '@/apiRequests/apiDB'
import {
  columns,
  INITIAL_VISIBLE_COLUMNS,
} from '@/components/templates/one-trip-page/trip-table.config'
import { RenderCell } from '@/components/templates/one-trip-page/trip-table/RenderCell'
import { defaultSection } from '@/constants/defaultEntities'

type Props = {
  trip: Trip
}

export const TripTable = ({ trip }: Props) => {
  const queryClient = useQueryClient()
  const { id: slug } = useParams()
  const [sectionsToDisplay, setSectionsToDisplay] = useState<Section[]>([])
  const [currentSection, setCurrentSection] = useState<Section | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )

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
      toast.success('Trip successfully updated')
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Trip updating failed')
    },
  })

  const onSaveTableCell = (
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

    // if ((columnKey = 'transportType')) {
    //   // think about cell
    // }

    // TODO what about new section creating when we don't have a section ID?

    updateSectionMutation({ tripId: slug, sectionData: newSectionData })
  }

  // TODO only for Frontend...
  const onAddNewSection = () => {
    setSectionsToDisplay((prevSections) => [
      ...prevSections,
      createNewSection(prevSections.length),
    ])
    toast.success('Section added', {
      position: 'top-center',
    })
  }

  return (
    <>
      <div className='table-wrapper'>
        <div className='table'>
          <div className='thead'>
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
              sectionsToDisplay.map((section, index) => (
                <div key={index} className='tr'>
                  {columns.map((column) => (
                    <div
                      key={column.uid + section.name}
                      className='td'
                      style={{ width: `${column.width}px` }}
                    >
                      <RenderCell
                        columnKey={column.uid}
                        section={section}
                        onDeleteSection={() => {
                          updateTripMutation({
                            _id: trip._id,
                            sections: sectionsToDisplay.filter(
                              (item) => item.id !== section.id
                            ),
                          })
                        }}
                        onNoteClick={() => {
                          setCurrentSection(
                            sectionsToDisplay.find(
                              (item) => item.id === section.id
                            ) ?? null
                          )
                        }}
                        onSaveTableCell={onSaveTableCell}
                      />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className='text-center py-10'>
                <div className='mb-8'>{"You don't have any trip section"}</div>
                <Button
                  color='primary'
                  onPress={() => {
                    updateTripMutation({
                      _id: trip._id,
                      sections: [...sectionsToDisplay, defaultSection],
                    })
                  }}
                >
                  Create first
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <NotesDrawer section={currentSection} />
    </>
  )
}
