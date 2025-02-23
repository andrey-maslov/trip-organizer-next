'use client'

import {
  Calendar,
  dayjsLocalizer,
  Views,
  DateLocalizer,
} from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Trip } from '@/types/types'
import React, { useCallback, useMemo, useState } from 'react'

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
import { parseDate } from '@/lib/date'
import { getTripStartDate } from '@/utils/utils'
dayjs.extend(timezone)

const localizer = dayjsLocalizer(dayjs)

type Props = {
  trip: Trip
}

export const TripCalendar = ({ trip }: Props) => {
  // Have to use controlled state when using SSR (Next.js)
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(getTripStartDate(trip))

  const onView = useCallback((newView: any) => setView(newView), [setView])
  const onNavigate = useCallback((newDate: any) => setDate(newDate), [setDate])

  const eventsList: { title: string; start: Date; end: Date }[] =
    useMemo(() => {
      const filteredSections = trip.sections.filter(
        (section) =>
          section.isEnabled &&
          section.endPoint?.dateTime &&
          section.startingPoint?.dateTime
      )

      return filteredSections
        .map(({ startingPoint, endPoint, name }) => {
          return {
            title: name,
            start: parseDate(startingPoint?.dateTime) ?? new Date(),
            end: parseDate(endPoint?.dateTime) ?? new Date(),
          }
        })
        .filter((section) => section.start && section.end)
    }, [])

  const { defaultDate, views } = useMemo(
    () => ({
      defaultDate: new Date(),
      // max: dayjs().endOf('day').subtract(1, 'hours').toDate(),
      views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
    }),
    []
  )

  return (
    <div>
      <Calendar
        // defaultDate={defaultDate}
        localizer={localizer}
        events={eventsList}
        // showMultiDayTimes
        // step={60}
        date={date}
        onNavigate={onNavigate}
        // max={max}
        view={view}
        views={views}
        onView={onView}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 600 }}
      />
    </div>
  )
}
