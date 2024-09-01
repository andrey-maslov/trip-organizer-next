'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { toast } from 'react-toastify'
import { FiSettings } from 'react-icons/fi'
import { Tabs, Tab } from '@nextui-org/tabs'

import { deleteOneTrip, getOneTrip, updateTrip } from '@/apiRequests/apiDB'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'
import { Editable } from '@/components/Editable'
import { TripTable } from '@/components/templates/one-trip-page/trip-table/TripTable'
import { getFormattedDate } from '@/lib/date'
import { TripView } from '@/components/templates/one-trip-page/trip-view/TripView'
import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'

export const OneTrip = () => {
  const { slug } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch Trip
  const {
    isPending,
    error,
    data: trip,
  } = useQuery({
    queryKey: ['trip', slug],
    queryFn: () => getOneTrip(slug as string),
  })

  // Update Trip
  const { mutate: updateTripMutation } = useMutation({
    mutationFn: updateTrip,
    onSuccess: async () => {
      toast.success('Trip successfully updated!')
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      console.error(err)
      toast.error('Trip updating failed')
    },
  })

  const onDeleteTrip = () => {
    if (confirm('Do you really want to delete your trip data?')) {
      deleteOneTrip(slug as string)
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
      <div className='flex gap-4 mb-8 items-start'>
        <div className='flex min-w-[200px]'>
          <TripCoverEditable
            coverSrc={trip.cover}
            setCoverSrc={(cover) => {
              updateTripMutation({ ...trip, cover })
            }}
            tripName={trip.name}
          />
        </div>
        <div className='w-full'>
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

        <Dropdown>
          <DropdownTrigger>
            <button
              className='hover:bg-foreground-100 rounded-lg text-center p-2'
              title='manage trip'
            >
              <FiSettings />
            </button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem color='danger' onPress={onDeleteTrip}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Tabs aria-label='Options'>
        <Tab key='view' title='View mode'>
          <TripView trip={trip} />
        </Tab>
        <Tab key='edit' title='Edit mode'>
          <TripTable trip={trip} />
        </Tab>
      </Tabs>

      <NotesDrawer />
    </div>
  )
}
