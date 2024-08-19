'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import { FiPlus } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

import { getAllTrips } from '@/apiRequests/apiDB'
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

  if (error || !trips || trips.trips.length === 0) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <div className='container p-4 lg:p-8'>
      <div className='gap-2 grid grid-cols-2 sm:grid-cols-4'>
        {trips?.trips.map((trip) => (
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
                src={trip.cover ?? undefined}
                width='100%'
              />
            </CardBody>
            <CardFooter className='text-small justify-between'>
              <b>{trip.name}</b>
              {/*<p className='text-default-500'>{item.price}</p>*/}
            </CardFooter>
          </Card>
        ))}
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
    </div>
  )
}
