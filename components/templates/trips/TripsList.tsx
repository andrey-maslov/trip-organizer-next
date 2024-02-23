'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'
import { getAllTrips } from '@/apiRequests/apiRequests'

export default function TripsList() {
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
        {trips?.trips.map((item) => (
          <Card
            shadow='sm'
            key={item._id}
            isPressable
            onPress={() => console.log('item pressed')}
          >
            <CardBody className='overflow-visible p-0'>
              <Image
                shadow='sm'
                radius='lg'
                width='100%'
                alt={item.name}
                className='w-full object-cover h-[240px]'
                src={
                  'https://images.unsplash.com/photo-1699962622373-0872b71fae56?q=80&w=3024'
                }
              />
            </CardBody>
            <CardFooter className='text-small justify-between'>
              <b>{item.name}</b>
              {/*<p className='text-default-500'>{item.price}</p>*/}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
