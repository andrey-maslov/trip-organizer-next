'use client'

import React, { FC, useState } from 'react'
import { DateType, TripPoint } from '@/types/models'
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react'
import { fakeAddresses } from '@/constants/defaultEntities'
import { format } from 'date-fns'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react'
import { timeZones } from '@/constants/timezones'
import { DayPicker } from 'react-day-picker'

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
    console.log(date.getTimezoneOffset())
    setSelectedDate(newDate)
    setCalendarOpened(false)
  }

  // console.log(selectedDate)
  // console.log(selectedTime)

  return (
    <div className='flex items-center relative max-w-[140px] overflow-hidden'>
      <Button
        color='default'
        size='sm'
        variant='light'
        onClick={() => setOpen(true)}
      >
        {data?.place?.name ?? 'n/d'}
        <br />
        {data?.date ? format(data?.date, 'PP') : '-'} {data?.time}
      </Button>

      <Modal backdrop='opaque' size='md' isOpen={isOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Set your starting place
              </ModalHeader>
              <ModalBody>
                <Input
                  size='sm'
                  type='text'
                  variant='underlined'
                  placeholder='Enter starting place'
                />
                <Autocomplete
                  size='sm'
                  // label='Address'
                  placeholder='Search an address'
                  defaultItems={fakeAddresses}
                  variant='underlined'
                  shouldCloseOnBlur
                >
                  {(item) => (
                    <AutocompleteItem key={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <div className='flex w-full flex-wrap md:flex-nowrap items-center gap-2 mt-4'>
                  <Popover
                    placement='top'
                    isOpen={isCalendarOpened}
                    onOpenChange={(open) => setCalendarOpened(open)}
                  >
                    <PopoverTrigger>
                      <Button size='md' className='min-w-[150px]'>
                        {format(Date(), 'PP')}
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
                    type='time'
                    size='sm'
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className='max-w-[200px]'
                  />
                </div>
                <Autocomplete
                  size='sm'
                  label='Time zone'
                  placeholder='Search an address'
                  defaultItems={timeZones.map((value) => ({
                    label: value,
                    value,
                  }))}
                  shouldCloseOnBlur
                  variant='underlined'
                  className='max-w-[14rem]'
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
