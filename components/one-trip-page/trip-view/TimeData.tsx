import { IoMdTimer } from 'react-icons/io'
import {
  getFormattedDate,
  getFormattedTime,
  getHumanizedTimeDuration,
} from '@/lib/date'
import { GiDuration } from 'react-icons/gi'
import React from 'react'

type Props = {
  startTime: string | undefined
  endTime: string | undefined
}

export const DateTime = ({ startTime, endTime }: Props) => {
  return (
    <div className='flex'>
      {startTime && (
        <>
          <IoMdTimer className='mt-1 mr-2 text-foreground-400' />
          <span className='inline-block mr-2'>
            {getFormattedTime(startTime, { locale: 'ru' })}
          </span>
          <span className='text-default-500 font-light'>
            {getFormattedDate(startTime, 'full')}
          </span>
        </>
      )}
      {startTime && endTime && (
        <>
          <GiDuration className='mt-1 mx-4' />
          <span className='text-default-500 font-light'>
            {getHumanizedTimeDuration(startTime, endTime)}
          </span>
        </>
      )}
    </div>
  )
}
