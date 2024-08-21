'use client'

import React, { FC, useState } from 'react'
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react'
import { DayPicker } from 'react-day-picker'

import { timeZones } from '@/constants/timezones'
import { fakeAddresses } from '@/constants/defaultEntities'
import { TripPoint } from '@/types/models'
import { getFormattedDate } from '@/lib/date'

type PointCellProps = {
  data: TripPoint | undefined
  onUpdate: (value: TripPoint) => void
}

export const TripPointCell: FC<PointCellProps> = ({ data }) => {
  const [isOpen, setOpen] = useState(false)
  const [isCalendarOpened, setCalendarOpened] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data?.date)
  const [selectedTime, setSelectedTime] = useState<string>('00:00')

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value

    if (!selectedDate) {
      setSelectedTime(time)

      return
    }
    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10))
    const newSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes
    )

    setSelectedDate(newSelectedDate)
    setSelectedTime(time)
  }

  const handleDaySelect = (date: Date | undefined) => {
    if (!selectedTime || !date) {
      setSelectedDate(date)

      return
    }
    const [hours, minutes] = selectedTime
      .split(':')
      .map((str) => parseInt(str, 10))
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    )

    // console.log(date.getTimezoneOffset())
    setSelectedDate(newDate)
    setCalendarOpened(false)
  }

  // console.log(selectedDate)
  // console.log(selectedTime)

  return (
    <div className='flex items-center relative max-w-[140px] overflow-hidden p-1'>
      <Button
        color='default'
        size='sm'
        variant='light'
        onClick={() => setOpen(true)}
      >
        {data?.place?.name ?? 'n/d'}
        <br />
        {data?.date ? getFormattedDate(data?.date) : '-'} {data?.time}
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
              <ModalHeader className='flex flex-col gap-1'>
                Set your starting place
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder='Enter starting place'
                  size='sm'
                  type='text'
                  variant='underlined'
                />
                <Autocomplete
                  shouldCloseOnBlur
                  defaultItems={fakeAddresses}
                  variant='underlined'
                  size='sm'
                  // label='Address'
                  placeholder='Search an address'
                >
                  {(item) => (
                    <AutocompleteItem key={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <div className='flex w-full flex-wrap md:flex-nowrap items-center gap-2 mt-4'>
                  <Popover
                    isOpen={isCalendarOpened}
                    placement='top'
                    onOpenChange={(open) => setCalendarOpened(open)}
                  >
                    <PopoverTrigger>
                      <Button className='min-w-[150px]' size='md'>
                        {getFormattedDate(Date())}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <DayPicker
                        mode='single'
                        selected={selectedDate}
                        onSelect={handleDaySelect}
                      />
                    </PopoverContent>
                  </Popover>

                  <Input
                    className='max-w-[200px]'
                    size='sm'
                    type='time'
                    value={selectedTime}
                    onChange={handleTimeChange}
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
                  placeholder='Search an address'
                  size='sm'
                  variant='underlined'
                >
                  {(item) => (
                    <AutocompleteItem key={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
