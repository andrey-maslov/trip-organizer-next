'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardBody, CardFooter, Image } from "@heroui/react"
import { FiPlus } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

import { getAllTrips } from '@/queries/queries.db'
import { defaultCoverImage } from '@/constants/defaultEntities'

export default function TripsList() {
  const router = useRouter()

  const {
    isPending,
    error,
    data: trips,
  } = useQuery({
    queryKey: ['trips'],
    queryFn: getAllTrips,
  })

  if (isPending) return 'Loading...'

  if (error || !trips) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <>
      {trips.trips.length === 0 && (
        <div className='p-8 text-xl'>
          You have no trips. Add the first by pressing the button below
        </div>
      )}
      <div className='gap-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
        {trips.trips.length > 0
          ? trips?.trips.map((trip) => (
              <Card
                key={trip._id}
                isPressable
                shadow='sm'
                onPress={() => router.push(`/trips/${trip.slug || trip._id}`)}
              >
                <CardBody className='overflow-visible p-0'>
                  <Image
                    alt={trip.name}
                    className='w-full object-cover h-[240px]'
                    fallbackSrc={defaultCoverImage}
                    radius='lg'
                    shadow='sm'
                    src={trip.cover || defaultCoverImage}
                    width='100%'
                  />
                </CardBody>
                <CardFooter className='text-small justify-between'>
                  <b>{trip.name}</b>
                  {/*<p className='text-default-500'>{item.price}</p>*/}
                </CardFooter>
              </Card>
            ))
          : null}
        <Card
          key='new'
          isPressable
          shadow='sm'
          onPress={() => router.push('/trips/new-trip')}
        >
          <CardBody className='overflow-visible p-20 flex flex-col justify-center items-center'>
            <FiPlus className='text-yellow-500 text-4xl mb-4' />
            <span className='text-foreground'>Add new Trip</span>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
