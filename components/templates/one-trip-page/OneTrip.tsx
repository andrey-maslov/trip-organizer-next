'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteOneTrip, getOneTrip, updateTrip } from '@/apiRequests/apiDB'
import { useParams, useRouter } from 'next/navigation'
import { Divider } from '@nextui-org/react'
import { Button } from '@nextui-org/button'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'
import { Editable } from '@/components/Editable'
import { TripTable } from '@/components/templates/one-trip-page/trip-table/TripTable'

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
              tag='h1'
              content={trip?.name}
              className='font-bold text-3xl'
              setContent={(name) => updateTripMutation({ ...trip, name })}
            />
            <div className='text-foreground-400'>
              <span>Slug: </span>
              <Editable
                tag='span'
                content={(trip?.slug || trip?.name)
                  .replaceAll(/ +|\./gi, '-')
                  .toLowerCase()
                  .trim()}
                setContent={(slug) => updateTripMutation({ ...trip, slug })}
              />
            </div>
          </div>
          <Editable
            tag='h2'
            content={trip?.description}
            className='text-xl text-foreground-500 mb-4'
            setContent={(description) =>
              updateTripMutation({ ...trip, description })
            }
          />
          <h2 className='text-xl mb-8 text-foreground'>
            {trip?.dateTimeStart
              ? `From ${format(trip.dateTimeStart, 'PP')}`
              : ''}{' '}
            {trip?.dateTimeEnd ? `to ${format(trip.dateTimeEnd, 'PP')}` : ''}
          </h2>
        </div>
      </div>
      {/*<OneTripTable sections={trip?.sections ?? []} />*/}
      <TripTable sections={trip?.sections ?? []} />
      <Divider className='my-8' />
      <div className='flex justify-end'>
        <Button onClick={onDeleteTrip} color='danger'>
          Delete trip
        </Button>
      </div>
    </div>
  )
}
