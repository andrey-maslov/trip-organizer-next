'use client'

import React, { FC, useState } from 'react'
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
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

import { timeZones } from '@/constants/timezones'
import { GAPlace, TripPoint } from '@/types/types'
import {
  CustomData,
  CustomDateTimePicker,
} from '@/components/CustomDateTimePicker'
import { getFormattedDate, getFormattedTime, getTimeZone } from '@/lib/date'
import { defaultPoint } from '@/constants/defaultEntities'
import { truncateSentence } from '@/lib/utils'
import { ButtonEdit } from '@/components/ButtonEdit'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'YOUR_API_KEY'
// const placeNameTypes = ['locality', 'political'] // to think about field address_components https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=en#PlaceResult.address_components

type PointCellProps = {
  initialPoint: TripPoint
  onUpdate: (value: TripPoint) => void
  title: string
}

const placeAutocompleteStyles = {
  input: (provided: any) => ({
    ...provided,
    // color: 'blue',
  }),
  option: (provided: any) => ({
    ...provided,
    // color: 'blue',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    // color: 'blue',
  }),
}

export const TripPointCell: FC<PointCellProps> = ({
  initialPoint,
  onUpdate,
  title,
}) => {
  // we have ISO string with time zone shift
  // we'd like to extract this timezone
  // We can save here date in ISO 8601 with Time Zone Extension, e.g. 2024-04-04T18:45:39+02:00[Europe/Warsaw]

  // dateTime: '2023-08-29T15:36:32.807Z',
  // timeZone: 'Europe/Warsaw',

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [editPlace, setEditPlace] = useState(
    !Boolean(initialPoint.place?.address)
  )
  const [point, setPoint] = useState(
    initialPoint ? initialPoint : { ...defaultPoint, timeZone: getTimeZone() }
  )
  const [place, setPlace] = useState<{
    label: string
    value: GAPlace | any
  } | null>(null)

  const [zonedDateTime, setZonedDateTime] = useState<CustomData>(() => {
    const currentDate = new Date()
    const dateISOString = initialPoint?.dateTime ?? currentDate.toISOString()

    return parseAbsolute(dateISOString, initialPoint?.timeZone ?? getTimeZone())
  })

  const savePoint = () => {
    const newPlace = place?.value
      ? {
          name: place?.value.structured_formatting.main_text,
          secondaryName: place?.value.structured_formatting.secondary_text,
          address: place?.value.description,
          placeId: place?.value.place_id,
        }
      : point.place

    const pointDto: TripPoint = {
      ...point,
      place: newPlace,
      dateTime: zonedDateTime.toAbsoluteString(),
    }

    onUpdate(pointDto)
  }

  const pointAddress = point.place?.address ?? place?.value?.description

  return (
    <div className='flex items-center relative max-w-[140px] overflow-hidden p-1'>
      <Button
        className='h-auto'
        color='default'
        size='sm'
        variant='light'
        onPress={onOpen}
      >
        {truncateSentence(initialPoint?.['place']?.name, 2) ?? '-'}
        <br />
        {getFormattedDate(initialPoint?.dateTime, 'medium')} <br />
        {getFormattedTime(initialPoint?.dateTime, {
          locale: 'ru',
          tz: initialPoint?.timeZone,
        })}
      </Button>

      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        size='md'
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
              <ModalBody>
                {pointAddress && !editPlace ? (
                  <div className='flex items-center justify-between'>
                    <div>{pointAddress}</div>
                    <ButtonEdit onClick={() => setEditPlace(!editPlace)} />
                  </div>
                ) : (
                  <div className='h-10'>
                    <GooglePlacesAutocomplete
                      apiKey={API_KEY}
                      selectProps={{
                        value: place,
                        onChange: (value) => setPlace(value),
                        styles: placeAutocompleteStyles,
                      }}
                    />
                  </div>
                )}

                <div className='flex w-full flex-wrap md:flex-nowrap items-center gap-2 mt-4'>
                  {/*Date Time*/}
                  <CustomDateTimePicker
                    label='Date and time'
                    value={zonedDateTime}
                    onChange={(value) => {
                      const updatedValue = value.set({
                        second: 0,
                        millisecond: 0,
                      })

                      setZonedDateTime(updatedValue)
                    }}
                  />
                </div>
                {/*Time zone*/}
                <Autocomplete
                  shouldCloseOnBlur
                  className='max-w-[14rem]'
                  defaultItems={timeZones.map((value) => ({
                    label: value,
                    value,
                  }))}
                  // defaultSelectedKey={getTimeZone()}
                  inputValue={point.timeZone as string}
                  label='Time zone'
                  placeholder='Select time zone'
                  size='sm'
                  variant='underlined'
                  onSelectionChange={(value) => {
                    setPoint((prev) => ({
                      ...prev,
                      timeZone: value as string,
                    }))

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
