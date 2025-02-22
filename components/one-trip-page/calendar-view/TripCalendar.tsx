import { Calendar, dayjsLocalizer,
  Views,
  DateLocalizer, } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Trip } from '@/types/types'
import React, { useMemo } from 'react'

// the dayjsLocalizer extends Day.js with the following plugins:
// - IsBetween
// - IsSameOrAfter
// - IsSameOrBefore
// - LocaleData
// - LocalizedFormat
// - MinMax
// - UTC

// add optional time zone support
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(timezone)

const localizer = dayjsLocalizer(dayjs)

type Props = {
  trip: Trip
}

export const TripCalendar = ({ trip }: Props) => {

  const eventsList = useMemo(() => trip.sections.map(({startingPoint, endPoint, name}) => {
    const currentDate = new Date()
    const startDateISOString = startingPoint?.dateTime ?? currentDate.toISOString()
    const endDateISOString = endPoint?.dateTime ?? currentDate.toISOString()

    return {
      title: name,
      start: new Date(startDateISOString),
      end: new Date(endDateISOString),
    }
  }), [])

  const { defaultDate, views, max } = useMemo(
    () => ({
      defaultDate: new Date(2024, 8, 1),
      max: dayjs().endOf('day').subtract(1, 'hours').toDate(),
      views: Object.keys(Views).map((k) => Views[k as keyof typeof Views]),
    }),
    []
  )

  return (
    <div>
      <Calendar
        defaultDate={defaultDate}
        localizer={localizer}
        events={eventsList}
        showMultiDayTimes
        step={60}
        max={max}
        views={views}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
      />
    </div>
  )
}
