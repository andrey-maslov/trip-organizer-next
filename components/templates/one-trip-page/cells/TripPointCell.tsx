'use client'

import React, { FC, Key, useState } from 'react'
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { parseAbsolute, toTimeZone } from '@internationalized/date'

import { timeZones } from '@/constants/timezones'
import { fakeAddresses } from '@/constants/defaultEntities'
import { TripPoint } from '@/types/models'
import {
  CustomData,
  CustomDateTimePicker,
} from '@/components/CustomDateTimePicker'
import { getFormattedDate, getFormattedTime, getTimeZone } from '@/lib/date'

type PointCellProps = {
  point: TripPoint
  onUpdate: (value: TripPoint) => void
  title: string
}

export const TripPointCell: FC<PointCellProps> = ({
  point = {},
  onUpdate,
  title,
}) => {
  // we have ISO string with time zone shift
  // we'd like to extract this timezone
  // We can save here date in ISO 8601 with Time Zone Extension, e.g. 2024-04-04T18:45:39+02:00[Europe/Warsaw]

  // dateTime: '2023-08-29T15:36:32.807Z',
  // timeZone: 'Europe/Warsaw',

  const [isOpen, setOpen] = useState(false)
  const [name, setName] = useState(point.name)
  const [address, setAddress] = useState(point.address)
  const [timeZone, setTimeZone] = useState<Key>(getTimeZone())
  const [zonedDateTime, setZonedDateTime] = useState<CustomData>(() => {
    const currentDate = new Date()
    const dateISOString = point?.dateTime ?? currentDate.toISOString()

    return parseAbsolute(dateISOString, point?.timeZone ?? getTimeZone())
  })

  const savePoint = () => {
    const pointDto: TripPoint = {
      ...point,
      address,
      name,
      dateTime: zonedDateTime.toAbsoluteString(),
      timeZone: timeZone as string,
    }

    onUpdate(pointDto)
  }

  return (
    <div className='flex items-center relative max-w-[140px] overflow-hidden p-1'>
      <Button
        className='h-auto'
        color='default'
        size='sm'
        variant='light'
        onPress={() => setOpen(true)}
      >
        {point?.name ?? '-'}
        <br />
        {getFormattedDate(point?.dateTime, 'medium')} <br />
        {getFormattedTime(point?.dateTime, 'short', 'ru')}
      </Button>

      <Modal
        backdrop='opaque'
        isOpen={isOpen}
        size='md'
        onOpenChange={() => setOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
              <ModalBody>
                <Input
                  placeholder='Enter starting place'
                  size='sm'
                  type='text'
                  value={name}
                  variant='underlined'
                  onValueChange={setName}
                />
                <Autocomplete
                  shouldCloseOnBlur
                  defaultItems={fakeAddresses}
                  placeholder='Search an address'
                  size='sm'
                  variant='underlined'
                >
                  {(item) => (
                    <AutocompleteItem key={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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
                  label='Time zone'
                  placeholder='Select time zone'
                  selectedKey={timeZone as string}
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
