'use client'

import { useQuery } from '@tanstack/react-query'
import {
  deleteOneTrip,
  getOneTrip,
  updateTrip,
} from '@/apiRequests/apiRequests'
import { useParams, useRouter } from 'next/navigation'
import { OneTripTable } from '@/components/templates/one-trip-page/OneTripTable'
import { Divider } from '@nextui-org/react'
import { Button } from '@nextui-org/button'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { Section } from '@/types/models'

export const OneTrip = () => {
  const { id } = useParams()
  const router = useRouter()

  const {
    isPending,
    error,
    data: trip,
  } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getOneTrip(id as string),
  })

  const onDeleteTrip = () => {
    if (confirm('Do you really want to delete your trip data?')) {
      deleteOneTrip(id as string)
        .then(() => {
          router.push('/trips')
        })
        .catch((err) => console.log('Error: ' + err))
    }
  }

  const onUpdateTrip = (newSections?: Section[]) => {
    const newTripDto = { ...trip }

    if (newSections) {
      newTripDto.sections = newSections
    }

    updateTrip(newTripDto)
      .then(() => {
        toast.success('Trip successfully updated', {
          position: 'top-center',
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Trip updating failed', {
          position: 'top-center',
        })
      })
  }

  if (isPending) return 'Loading...'

  if (error) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <div className='container p-4 lg:p-8'>
      <h1 className='font-bold text-3xl mb-4'>{trip?.name}</h1>
      <h2 className='text-xl text-foreground-500 mb-4'>{trip?.description}</h2>
      <h2 className='text-xl mb-8 text-foreground'>
        {trip?.dateTimeStart ? `From ${format(trip.dateTimeStart, 'PP')}` : ''}{' '}
        {trip?.dateTimeEnd ? `to ${format(trip.dateTimeEnd, 'PP')}` : ''}
      </h2>
      <OneTripTable
        sections={trip?.sections ?? []}
        onUpdateTrip={onUpdateTrip}
      />
      <Divider className='my-8' />
      <div className='flex justify-end'>
        <Button onClick={onDeleteTrip} color='danger'>
          Delete trip
        </Button>
      </div>
    </div>
  )
}
