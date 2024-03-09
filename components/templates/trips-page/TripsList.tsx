'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import { getAllTrips } from '@/apiRequests/apiRequests'
import { FiPlus } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
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
            shadow='sm'
            key={trip._id}
            isPressable
            onPress={() => router.push(`/trips/${trip._id}`)}
          >
            <CardBody className='overflow-visible p-0'>
              <Image
                shadow='sm'
                radius='lg'
                width='100%'
                alt={trip.name}
                className='w-full object-cover h-[240px]'
                src={trip.cover ?? undefined}
                fallbackSrc={defaultCoverImage}
              />
            </CardBody>
            <CardFooter className='text-small justify-between'>
              <b>{trip.name}</b>
              {/*<p className='text-default-500'>{item.price}</p>*/}
            </CardFooter>
          </Card>
        ))}
        <Card
          shadow='sm'
          key='new'
          isPressable
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
