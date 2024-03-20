import { getFormattedDate, getFormattedTime } from '@/lib/date'
import { DateType } from '@/types/models'
import { DayPicker } from 'react-day-picker'
import { Button } from '@nextui-org/button'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { FiEdit2 } from 'react-icons/fi'

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
    <div className='flex items-center relative cell-editable'>
      <div className='flex flex-col'>
        <p className='text-bold text-small capitalize'>
          {getFormattedDate(dateTime)}
        </p>
        <p className='text-bold text-tiny capitalize text-default-500'>
          {getFormattedTime(dateTime)}
        </p>
      </div>
      <Popover placement='right' showArrow>
        <PopoverTrigger>
          <Button
            isIconOnly
            size='sm'
            color='warning'
            variant='faded'
            aria-label='edit'
            className='btn-edit'
          >
            <FiEdit2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className='px-1 py-2'>
            <DayPicker
              mode='single'
              selected={selectedDateStart as Date}
              onSelect={setSelectedDateStart}
              footer={
                <div className='flex gap-2 justify-items-end'>
                  <Button
                    size='sm'
                    onClick={() => setSelectedDateStart(undefined)}
                  >
                    Reset
                  </Button>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={() => {
                      onUpdate(selectedDateStart)
                    }}
                  >
                    Save
                  </Button>
                </div>
              }
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
