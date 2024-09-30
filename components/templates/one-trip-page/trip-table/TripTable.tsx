import { Button, Divider, Selection } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { IoMdAdd } from 'react-icons/io'

import { Section, Trip } from '@/types/types'
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
  const { slug } = useParams()
  const [sectionsToDisplay, setSectionsToDisplay] = useState<Section[]>([])
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
      toast.success('Trip successfully updated!!')
      console.log(slug)
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

    updateSectionMutation({ tripId: slug, sectionData: newSectionData })
  }

  const onAddNewSection = () => {
    updateTripMutation({
      _id: trip._id,
      sections: [...sectionsToDisplay, defaultSection],
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
                        tripId={trip._id}
                        onDeleteSection={() => {
                          updateTripMutation({
                            _id: trip._id,
                            sections: sectionsToDisplay.filter(
                              (item) => item.id !== section.id
                            ),
                          })
                        }}
                        onMoveSection={(sectionId, direction) => {
                          const rearrangedSections = moveObject(
                            sectionsToDisplay,
                            sectionId,
                            direction
                          )

                          updateTripMutation({
                            _id: trip._id,
                            sections: rearrangedSections,
                          })
                        }}
                        onSave={onSaveTableCell}
                      />
                    </div>
                  ))}
                </div>
              ))
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

        <Divider />
        <div className='py-3 flex justify-center'>
          <Button
            isIconOnly
            className='bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white shadow-lg'
            title='Add new section'
            onPress={onAddNewSection}
          >
            <IoMdAdd />
          </Button>
        </div>
      </div>
    </>
  )
}

const moveObject = (
  items: Section[],
  objectId: string,
  direction: 'up' | 'down'
): Section[] => {
  // Найдем индекс объекта, который нужно переместить
  const index = items.findIndex((item) => item.id === objectId)

  // Если объект не найден, возвращаем массив без изменений
  if (index === -1) {
    return items
  }

  // Обработаем перемещение вверх
  if (direction === 'up' && index > 0) {
    const newItems = [...items]

    // Меняем местами текущий объект и объект выше по списку
    ;[newItems[index], newItems[index - 1]] = [
      newItems[index - 1],
      newItems[index],
    ]

    return newItems
  }

  // Обработаем перемещение вниз
  if (direction === 'down' && index < items.length - 1) {
    const newItems = [...items]

    // Меняем местами текущий объект и объект ниже по списку
    ;[newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ]

    return newItems
  }

  // Если объект на границе списка и не может быть перемещен, возвращаем массив без изменений
  return items
}
