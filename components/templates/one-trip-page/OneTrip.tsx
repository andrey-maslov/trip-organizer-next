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
import { Spinner } from '@nextui-org/spinner'
import React from 'react'

import { deleteOneTrip, getOneTrip, updateTrip } from '@/queries/queries.db'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'
import { Editable } from '@/components/Editable'
import { TripTable } from '@/components/templates/one-trip-page/trip-table/TripTable'
import { getFormattedDate } from '@/lib/date'
import { TripView } from '@/components/templates/one-trip-page/trip-view/TripView'
import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'
import { useIsMobile } from '@/hooks/useIsMobile'
import { TripSummary } from '@/components/templates/one-trip-page/TripSummary'

export const OneTrip = () => {
  const { slug } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const isMobile = useIsMobile()

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

  if (isPending) {
    return (
      <div className='py-16 flex justify-center'>
        <Spinner color='warning' size='md' />
      </div>
    )
  }

  if (error) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <div className=''>
      <div className='flex gap-4 mb-4 flex-wrap md:flex-nowrap items-start'>
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
          <div className='flex gap-4 mb-4 items-center flex-wrap md:flex-nowrap'>
            <Editable
              className='font-bold text-xl xl:text-3xl'
              content={trip?.name}
              setContent={(name) => updateTripMutation({ ...trip, name })}
              tag='h1'
            />
            <div className='text-foreground-400 text-sm md:text-md'>
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
            className='text-md xl:text-xl text-foreground-500 mb-4'
            content={trip?.description}
            setContent={(description) =>
              updateTripMutation({ ...trip, description })
            }
            tag='h2'
          />
          <h2 className='text-md xl:text-xl mb-2 lg:mb-8 text-foreground'>
            {trip?.dateTimeStart
              ? `From ${getFormattedDate(trip.dateTimeStart)}`
              : ''}{' '}
            {trip?.dateTimeEnd
              ? `to ${getFormattedDate(trip.dateTimeEnd)}`
              : ''}
          </h2>
        </div>

        {/*Settings*/}
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

      <Tabs
        aria-label='Options'
        defaultSelectedKey={isMobile ? 'view' : 'edit'}
      >
        <Tab key='view' title='View mode'>
          <TripView trip={trip} />
        </Tab>
        <Tab key='edit' title='Edit mode'>
          <TripTable trip={trip} />
        </Tab>
      </Tabs>

      {/* SUMMARY */}
      <TripSummary trip={slug as string} />
      <NotesDrawer />
    </div>
  )
}
