import React, { useState } from 'react'
import { Button, Card, CardBody } from '@heroui/react'
import { CardHeader } from '@heroui/card'
import { IoMdTimer } from 'react-icons/io'
import { GiDuration } from 'react-icons/gi'
import { FaExpand } from 'react-icons/fa'
import { BsGeoAlt } from 'react-icons/bs'
import { Link } from '@heroui/link'
import { Divider } from '@heroui/divider'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

import { Trip } from '@/types/types'
import { SectionTypeIcon } from '@/components/SectionTypeIcon'
import {
  getFormattedDate,
  getFormattedTime,
  getHumanizedTimeDuration,
} from '@/lib/date'
import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/one-trip-page/trip-table.config'
import { CopyToClipboard } from '@/components/CopyToClipboard'
import { useQueryParams } from '@/hooks/useQueryParams'
import { createNote } from '@/queries/queries.db'
import { StatusButton } from '@/components/one-trip-page/cells/StatusButton'
import { DateTime } from '@/components/one-trip-page/trip-view/TimeData'
import { TripViewCard } from '@/components/one-trip-page/trip-view/TripViewCard'

type Props = {
  trip: Trip
}

export const TripView = ({ trip }: Props) => {
  const { setQueryParams } = useQueryParams()

  // Create new Note
  const { mutate: createNoteMutation, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: (res) => {
      setQueryParams({ note: res._id })
    },
  })

  const onOpenNote = (tripId: string, sectionId: string, noteId?: string) => {
    if (noteId) {
      setQueryParams({ note: noteId, fullscreen: true })
    } else {
      // create note and set noteId as query param
      createNoteMutation({
        sectionId,
        tripId: tripId,
      })
    }
  }

  return (
    <div>
      {trip.sections.map((section) => (
        <TripViewCard key={section._id} section={section} />
      ))}
    </div>
  )
}
