import React from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/card'
import { IoMdTimer } from 'react-icons/io'
import { GiDuration } from 'react-icons/gi'
import { FaExpand } from 'react-icons/fa'
import { BsGeoAlt } from 'react-icons/bs'
import { Link } from '@nextui-org/link'
import { Divider } from '@nextui-org/divider'
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
      {trip.sections.map((section) => {
        if (!section.isEnabled) {
          return null
        }

        const startTime = section.startingPoint?.dateTime
        const endTime = section.endPoint?.dateTime
        const startAddress = section.startingPoint?.place?.address

        return (
          <Card key={section._id} className='max-w-[400px] mb-2'>
            <CardHeader className='flex flex-col items-start'>
              <div className='flex items-start gap-3 w-full'>
                <SectionTypeIcon
                  classNames='mt-1 text-yellow-500'
                  type={section.type}
                />
                <p className='text-md font-bold mb-2 w-full'>{section.name}</p>
                <button
                  className='hover:bg-foreground-100 rounded-lg text-center p-2 text-foreground-600'
                  title='expand section'
                  onClick={() =>
                    onOpenNote(
                      trip._id,
                      section._id as string,
                      section.note as string
                    )
                  }
                >
                  <FaExpand />
                </button>
              </div>
              <Button
                disabled
                className='h-6 ml-7'
                color={statusColorMap[section.status]}
                size='sm'
                variant='flat'
              >
                {statusOptionsMap[section.status]}
              </Button>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className='flex mb-4'>
                {startTime && (
                  <>
                    <IoMdTimer className='mt-1 mr-2' />
                    <span className='inline-block mr-2'>
                      {getFormattedTime(startTime, { locale: 'ru' })}
                    </span>
                    <span className='text-default-500 font-light'>
                      {getFormattedDate(startTime, 'medium')}
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

              {startAddress && (
                <div>
                  <div className='flex text-sm mb-4'>
                    <BsGeoAlt className='mr-2 text-xl' />
                    <div className='mr-4'>{startAddress}</div>
                    <CopyToClipboard
                      text={startAddress}
                      onCopy={() => toast.success('Address copied')}
                    />
                  </div>
                  <Button
                    as={Link}
                    className='ml-4 p-2 h-6'
                    color='primary'
                    href={`https://www.google.com/maps?q=${encodeURIComponent(startAddress)}`}
                    rel='noreferrer'
                    size='sm'
                    target='_blank'
                    variant='light'
                  >
                    Show directions
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
