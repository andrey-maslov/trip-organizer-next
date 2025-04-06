'use client'

import React, { FC, useEffect, useState } from 'react'
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { Button } from '@heroui/react'
import { parseAbsolute, toTimeZone } from '@internationalized/date'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

import { timeZones } from '@/constants/timezones'
import { GAPlace } from '@/types/types'
import {
  CustomData,
  CustomDateTimePicker,
} from '@/components/CustomDateTimePicker'
import { getTimeZone } from '@/lib/date'
import { defaultPoint } from '@/constants/defaultEntities'
import { ButtonEdit } from '@/components/ButtonEdit'
import { TripPointPreview } from '@/components/one-trip-page/cells/TripPointPreview'
import GoogleAutocomplete from "react-google-autocomplete";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'YOUR_API_KEY'
// const placeNameTypes = ['locality', 'political'] // to think about field address_components https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=en#PlaceResult.address_components

type TripPoint = {
  place: {
    name?: string
    secondaryName?: string
    address?: string
    placeId?: string
  }
  dateTime?: string
  timeZone?: string
}

const availableTimeZones =
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : []

type PointCellProps = {
  point: TripPoint
  previousPoint?: TripPoint
  onUpdate: (value: TripPoint) => void
  title: string
}

const POINT_DEFAULT: TripPoint = { place: {} }

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
  point, // current point
  previousPoint, // previous point
  onUpdate,
  title,
}) => {
  // we have ISO string with time zone shift
  // we'd like to extract this timezone
  // We can save here date in ISO 8601 with Time Zone Extension, e.g. 2024-04-04T18:45:39+02:00[Europe/Warsaw]

  // dateTime: '2023-08-29T15:36:32.807Z',
  // timeZone: 'Europe/Warsaw',

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [currentPoint, setCurrentPoint] = useState(() => {
    return point ?? previousPoint ?? defaultPoint
  })

  const [editPlace, setEditPlace] = useState(!Boolean(point?.place?.address))

  const [place, setPlace] = useState<{
    label: string
    value: GAPlace | any
  } | null>(null)

  const [zonedDateTime, setZonedDateTime] = useState<CustomData>(() => {
    const currentDate = new Date()
    const dateISOString = currentPoint?.dateTime ?? currentDate.toISOString()

    return parseAbsolute(
      dateISOString,
      previousPoint?.timeZone ?? getTimeZone()
    )
  })

  useEffect(() => {
    const newPoint = point ?? previousPoint ?? defaultPoint

    setCurrentPoint(newPoint)
    setZonedDateTime(() => {
      const currentDate = new Date()
      const dateISOString = newPoint?.dateTime ?? currentDate.toISOString()

      return parseAbsolute(
        dateISOString,
        previousPoint?.timeZone ?? getTimeZone()
      )
    })
    if (newPoint.place?.name) {
      setPlace({
        label: newPoint.place.name,
        value: { place_id: newPoint.place.placeId },
      })
    }
  }, [point, previousPoint])

  const savePoint = () => {
    const newPlace = place?.value
      ? {
          name: place?.value.structured_formatting.main_text,
          secondaryName: place?.value.structured_formatting.secondary_text,
          address: place?.value.description,
          placeId: place?.value.place_id,
        }
      : currentPoint.place

    const pointDto: TripPoint = {
      ...currentPoint,
      place: newPlace,
      dateTime: zonedDateTime.toAbsoluteString(),
    }

    onUpdate(pointDto)
  }

  // console.log(place)

  const pointAddress = currentPoint.place?.address ?? place?.value?.description

  return (
    <div className='flex items-center relative w-full overflow-hidden p-1'>
      <Button
        fullWidth
        color='default'
        className='h-auto min-h-2 text-inherit w-full'
        size='sm'
        variant='light'
        onPress={onOpen}
        title={currentPoint?.place?.name}
      >
        <TripPointPreview point={point} />
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
              <ModalBody className='relative'>
                {pointAddress && !editPlace ? (
                  <div className='flex items-center justify-between'>
                    <div>{pointAddress}</div>
                    <ButtonEdit onClick={() => setEditPlace(!editPlace)} />
                  </div>
                ) : (
                  <div className='h-10 relative z-30'>
                    {/*TODO consider utilising https://www.npmjs.com/package/react-google-autocomplete*/}
                    {/*<GooglePlacesAutocomplete*/}
                    {/*  apiKey={API_KEY}*/}
                    {/*  selectProps={{*/}
                    {/*    defaultValue: place,*/}
                    {/*    value: place,*/}
                    {/*    onChange: (value) => setPlace(value),*/}
                    {/*    styles: placeAutocompleteStyles,*/}
                    {/*  }}*/}
                    {/*/>*/}
                    <GoogleAutocomplete
                      apiKey={API_KEY}
                      defaultValue={currentPoint?.place?.address}
                      onPlaceSelected={(place) => {
                        console.log(place);
                      }}
                    />;
                  </div>
                )}

                <div className='flex w-full flex-wrap md:flex-nowrap items-center gap-2 mt-4'>
                  {/*Date Time*/}
                  <CustomDateTimePicker
                    label='Date and time'
                    value={zonedDateTime}
                    onChange={(value) => {
                      if (!value) {
                        return
                      }

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
                  inputValue={currentPoint.timeZone as string}
                  label='Time zone'
                  placeholder='Select time zone'
                  size='sm'
                  variant='underlined'
                  onSelectionChange={(value) => {
                    setCurrentPoint((prev) => ({
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
                <div className='flex justify-end gap-4 mt-4'>
                  <Button
                    className='mb-6'
                    color='warning'
                    onPress={() => {
                      onUpdate(POINT_DEFAULT)
                      onClose()
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    className='mb-6'
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
