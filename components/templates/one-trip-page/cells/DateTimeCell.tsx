import { DayPicker } from 'react-day-picker'
import { Button } from '@nextui-org/button'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'

import { DateType } from '@/types/types'
import { getFormattedDate, getFormattedTime } from '@/lib/date'

type DateTimeCellProps = {
  dateTime: DateType
  onUpdate: (value: DateType) => void
}

export const DateTimeCell: React.FC<DateTimeCellProps> = ({
  dateTime,
  onUpdate,
}) => {
  const [selectedDateStart, setSelectedDateStart] = useState<DateType>(dateTime)

  if (!dateTime) {
    return <div>-</div>
  }

  return (
    <div className='flex items-center relative editable-elemenet'>
      <div className='flex flex-col'>
        <p className='text-bold text-small capitalize'>
          {getFormattedDate(dateTime)}
        </p>
        <p className='text-bold text-tiny capitalize text-default-500'>
          {getFormattedTime(dateTime)}
        </p>
      </div>
      <Popover showArrow placement='right'>
        <PopoverTrigger>
          <Button
            isIconOnly
            aria-label='edit'
            className='btn-edit'
            color='warning'
            size='sm'
            variant='faded'
          >
            <FiEdit2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className='px-1 py-2'>
            <DayPicker
              footer={
                <div className='flex gap-2 justify-items-end'>
                  <Button
                    size='sm'
                    onPress={() => setSelectedDateStart(undefined)}
                  >
                    Reset
                  </Button>
                  <Button
                    color='primary'
                    size='sm'
                    onPress={() => {
                      onUpdate(selectedDateStart)
                    }}
                  >
                    Save
                  </Button>
                </div>
              }
              mode='single'
              selected={selectedDateStart as Date}
              onSelect={setSelectedDateStart}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
