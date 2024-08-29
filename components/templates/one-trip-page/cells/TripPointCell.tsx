'use client'

import React, { FC, Key, useState } from 'react'
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { parseAbsolute, toTimeZone } from '@internationalized/date'

import { timeZones } from '@/constants/timezones'
import { TripPoint } from '@/types/models'
import {
  CustomData,
  CustomDateTimePicker,
} from '@/components/CustomDateTimePicker'
import { getTimeZone } from '@/lib/date'
import { PlaceAutocomplete } from '@/components/templates/one-trip-page/cells/PlaceAutocomplete'
import { defaultPoint } from '@/constants/defaultEntities'

// const placeNameTypes = ['locality', 'political'] // to think about field address_components https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=en#PlaceResult.address_components

type PointCellProps = {
  initialPoint: TripPoint
  onUpdate: (value: TripPoint) => void
  title: string
}

export const TripPointCell: FC<PointCellProps> = ({
  initialPoint = {},
  onUpdate,
  title,
}) => {
  // we have ISO string with time zone shift
  // we'd like to extract this timezone
  // We can save here date in ISO 8601 with Time Zone Extension, e.g. 2024-04-04T18:45:39+02:00[Europe/Warsaw]

  // dateTime: '2023-08-29T15:36:32.807Z',
  // timeZone: 'Europe/Warsaw',

  // const [isOpen, setOpen] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [place, setPlace] = useState<TripPoint['place']>(
    initialPoint.place ?? defaultPoint.place
  )
  const [timeZone, setTimeZone] = useState<Key>(getTimeZone())
  const [zonedDateTime, setZonedDateTime] = useState<CustomData>(() => {
    const currentDate = new Date()
    const dateISOString = initialPoint?.dateTime ?? currentDate.toISOString()

    return parseAbsolute(dateISOString, initialPoint?.timeZone ?? getTimeZone())
  })

  const savePoint = () => {
    const pointDto: TripPoint = {
      ...initialPoint,
      place: {
        ...initialPoint.place,
        ...place,
      },
      dateTime: zonedDateTime.toAbsoluteString(),
      timeZone: timeZone as string,
    }

    onUpdate(pointDto)
  }

  return (
    <div className='flex items-center relative max-w-[140px] overflow-hidden p-1'>
      {/*<Button*/}
      {/*  className='h-auto'*/}
      {/*  color='default'*/}
      {/*  size='sm'*/}
      {/*  variant='light'*/}
      {/*  onPress={onOpen}*/}
      {/*>*/}
      {/*  {truncateSentence(initialPoint?.['place']?.name, 2) ?? '-'}*/}
      {/*  <br />*/}
      {/*  {getFormattedDate(initialPoint?.dateTime, 'medium')} <br />*/}
      {/*  {getFormattedTime(initialPoint?.dateTime, 'short', 'ru')}*/}
      {/*</Button>*/}

      <PlaceAutocomplete value={place.address} onPlaceSelect={setPlace} />

      <Modal
        onOpenChange={onOpenChange}
        backdrop='opaque'
        // isDismissable={false}
        isDismissable={false}
        size='md'
        // onOpenChange={() => setOpen(false)}
        isOpen={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
              <ModalBody>
                <PlaceAutocomplete
                  value={place.address}
                  onPlaceSelect={setPlace}
                />
                <div className='flex w-full flex-wrap md:flex-nowrap items-center gap-2 mt-4'>
                  <CustomDateTimePicker
                    label='Date and time'
                    value={zonedDateTime}
                    onChange={setZonedDateTime}
                  />
                </div>
                <Autocomplete
                  shouldCloseOnBlur
                  className='max-w-[14rem]'
                  defaultItems={timeZones.map((value) => ({
                    label: value,
                    value,
                  }))}
                  inputValue={timeZone as string}
                  label='Time zone'
                  placeholder='Select time zone'
                  size='sm'
                  variant='underlined'
                  onSelectionChange={(value) => {
                    setTimeZone(value as string)
                    setZonedDateTime(toTimeZone(zonedDateTime, value as string))
                  }}
                >
                  {(item) => (
                    <AutocompleteItem key={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <div className='flex justify-end'>
                  <Button
                    color='primary'
                    onPress={() => {
                      savePoint()
                      onClose()
                    }}
                  >
                    Save
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
