'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { Divider } from '@nextui-org/react'
import { Button } from '@nextui-org/button'
import { toast } from 'react-toastify'

import { deleteOneTrip, getOneTrip, updateTrip } from '@/apiRequests/apiDB'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'
import { Editable } from '@/components/Editable'
import { TripTable } from '@/components/templates/one-trip-page/trip-table/TripTable'
import { getFormattedDate } from '@/lib/date'

export const OneTrip = () => {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch Trip
  const {
    isPending,
    error,
    data: trip,
  } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getOneTrip(id as string),
  })

  // Update Trip
  const { mutate: updateTripMutation } = useMutation({
    mutationFn: updateTrip,
    onSuccess: async () => {
      toast.success('Trip successfully updated')
      await queryClient.invalidateQueries({ queryKey: ['trip', id] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Trip updating failed')
    },
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

  if (isPending) return 'Loading...'

  if (error) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <div className='container p-4 lg:p-8'>
      <div className='flex gap-4 mb-8 items-center'>
        <div>
          <TripCoverEditable
            coverSrc={trip.cover}
            setCoverSrc={(cover) => {
              updateTripMutation({ ...trip, cover })
            }}
            tripName={trip.name}
          />
        </div>
        <div>
          <div className='flex gap-4 mb-4 items-center'>
            <Editable
              className='font-bold text-3xl'
              content={trip?.name}
              setContent={(name) => updateTripMutation({ ...trip, name })}
              tag='h1'
            />
            <div className='text-foreground-400'>
              <span>Slug: </span>
              <Editable
                content={(trip?.slug || trip?.name)
                  .replaceAll(/ +|\./gi, '-')
                  .toLowerCase()
                  .trim()}
                setContent={(slug) => updateTripMutation({ ...trip, slug })}
                tag='span'
              />
            </div>
          </div>
          <Editable
            className='text-xl text-foreground-500 mb-4'
            content={trip?.description}
            setContent={(description) =>
              updateTripMutation({ ...trip, description })
            }
            tag='h2'
          />
          <h2 className='text-xl mb-8 text-foreground'>
            {trip?.dateTimeStart
              ? `From ${getFormattedDate(trip.dateTimeStart)}`
              : ''}{' '}
            {trip?.dateTimeEnd
              ? `to ${getFormattedDate(trip.dateTimeEnd)}`
              : ''}
          </h2>
        </div>
      </div>
      {/*<OneTripTable sections={trip?.sections ?? []} />*/}
      <TripTable sections={trip?.sections ?? []} />
      <Divider className='my-8' />
      <div className='flex justify-end'>
        <Button color='danger' onClick={onDeleteTrip}>
          Delete trip
        </Button>
      </div>
    </div>
  )
}
